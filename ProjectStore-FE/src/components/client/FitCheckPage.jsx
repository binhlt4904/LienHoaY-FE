import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import StartScreen from '../fitcheck-full/StartScreen';
import WardrobeModal from '../fitcheck-full/WardrobeModal';
import OutfitStack from '../fitcheck-full/OutfitStack';
import Spinner from '../fitcheck-full/Spinner';
import PosePanel from '../fitcheck-full/PosePanel';
import Sidebar from '../Sidebar';
import { ChevronDownIcon, ChevronUpIcon } from '../fitcheck-full/icons';
import { generateMixMatchImage, generatePoseVariation } from '../../services/geminiService';
import { defaultWardrobe } from '../../data/defaultWardrobe';
import { getFriendlyErrorMessage } from '../../lib/utils';
import {
  getModelImageFromSession,
  clearAllFitCheckSession,
} from '../../utils/sessionStorage';

const POSE_PROMPTS = {
  standing: "full body shot, standing straight, fashion model pose",
  handsonhips: "standing with hands on hips, confident fashion pose, full body",
  turned: "standing slightly turned, 3/4 view, fashion model pose, full body",
  side: "side profile view, fashion model pose, full body",
  walking: "walking towards camera, fashion runway pose, full body",
  jumping: "jumping in the air, dynamic fashion pose, full body",
  leaning: "leaning against a wall, casual fashion pose, full body",
  sitting: "sitting on a chair, fashion model pose, full body"
};

const detectCategory = (name) => {
  if (!name) return 'fullbody'; // Default fallback per user request
  const lowerName = name.toLowerCase();

  // 1. Check Top (Áo)
  if (lowerName.includes('áo') || 
      lowerName.includes('top') || 
      lowerName.includes('shirt') || 
      lowerName.includes('hoodie') ||
      lowerName.includes('jacket') ||
      lowerName.includes('coat') ||
      lowerName.includes('sweater')) {
      // Exclude special cases that might contain "áo" but are full body like "áo dài"
      if (!lowerName.includes('áo dài') && !lowerName.includes('bộ') && !lowerName.includes('set')) {
          return 'top';
      }
  }

  // 2. Check Bottom (Quần/Váy)
  if (lowerName.includes('quần') || 
      lowerName.includes('chân váy') || 
      lowerName.includes('short') || 
      lowerName.includes('jeans') || 
      lowerName.includes('pants') || 
      lowerName.includes('skirt') || 
      lowerName.includes('bottom') || 
      lowerName.includes('jogger') ||
      lowerName.includes('jort') ||
      lowerName.includes('trousers') ||
      lowerName.includes('legging') ||
      lowerName.includes('kaki')) {
    return 'bottom';
  }

  // 3. Check Accessory (Phụ kiện)
  if (lowerName.includes('túi') || 
      lowerName.includes('nón') || 
      lowerName.includes('mũ') || 
      lowerName.includes('kính') || 
      lowerName.includes('đồng hồ') || 
      lowerName.includes('dây chuyền') || 
      lowerName.includes('nhẫn') || 
      lowerName.includes('bông tai') || 
      lowerName.includes('bag') || 
      lowerName.includes('hat') || 
      lowerName.includes('cap') || 
      lowerName.includes('glasses') || 
      lowerName.includes('jewelry') || 
      lowerName.includes('accessory') || 
      lowerName.includes('phụ kiện') ||
      lowerName.includes('khuyên') ||
      lowerName.includes('vòng') ||
      lowerName.includes('wallet') ||
      lowerName.includes('backpack')) {
    return 'accessory';
  }

  // 4. Everything else -> Full Body (including 'bộ', 'set', 'áo dài', 'robe', 'buddhist', 'đầm', 'váy liền'...)
  return 'fullbody';
};

export default function FitCheckPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modelImageUrl, setModelImageUrl] = useState(null);

  // State: Outfit current parts (added fullbody)
  const [currentOutfit, setCurrentOutfit] = useState({ top: null, bottom: null, accessories: [], fullbody: null });

  // History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [currentPoseId, setCurrentPoseId] = useState('standing');
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);

  // Persistence: Wardrobe (localStorage)
  const [wardrobe, setWardrobe] = useState(() => {
    const saved = localStorage.getItem('fitcheck_wardrobe');
    let items = saved ? JSON.parse(saved) : [...defaultWardrobe];
    
    // Auto-fix categories for existing items based on new detection rules
    items = items.map(item => {
        const detected = detectCategory(item.name);
        // Special logic: If current is 'top' but detected is 'fullbody', switch it
        // Or if user specifically requested non-match to be fullbody
        if (item.category === 'top' && detected === 'fullbody') {
            return { ...item, category: 'fullbody' };
        }
        return item;
    });
    
    return items;
  });

  const [isWardrobeModalOpen, setIsWardrobeModalOpen] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  // --- PERSISTENCE LOGIC ---

  // Save wardrobe whenever it changes
  useEffect(() => {
    localStorage.setItem('fitcheck_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  // Save current session state (model + outfit + result) whenever it changes
  useEffect(() => {
    if (modelImageUrl) {
      // Optimize storage: Don't store full history to avoid QuotaExceededError
      let savedHistory = [];
      if(historyIndex >= 0 && history[historyIndex]) {
          savedHistory = [history[historyIndex]];
      }

      const sessionState = {
        modelImageUrl,
        currentOutfit,
        history: savedHistory, 
        historyIndex: savedHistory.length > 0 ? 0 : -1,
        currentPoseId
      };
      
      try {
        localStorage.setItem('fitcheck_current_session', JSON.stringify(sessionState));
      } catch (e) {
        console.warn("Storage quota exceeded. Session state could not be saved.", e);
      }
    }
  }, [modelImageUrl, currentOutfit, history, historyIndex, currentPoseId]);

  // Restore session on mount
  useEffect(() => {
    const savedSessionJson = localStorage.getItem('fitcheck_current_session');
    if (savedSessionJson) {
      try {
        const session = JSON.parse(savedSessionJson);
        if (session.modelImageUrl) {
          setModelImageUrl(session.modelImageUrl);
          
          // Migration for old session data structure
          let restoredOutfit = session.currentOutfit || { top: null, bottom: null, accessories: [], fullbody: null };
          
          // Handle accessory array migration
          if (restoredOutfit.accessory && !restoredOutfit.accessories) {
             restoredOutfit.accessories = [restoredOutfit.accessory];
             delete restoredOutfit.accessory;
          }
          // Handle missing fullbody field
          if (!restoredOutfit.fullbody) restoredOutfit.fullbody = null;

          setCurrentOutfit(restoredOutfit);
          setHistory(session.history || []);
          setHistoryIndex(session.historyIndex ?? -1);
          setCurrentPoseId(session.currentPoseId || 'standing');
          return; 
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }

    // Fallback
    const savedModel = getModelImageFromSession();
    if (savedModel) {
      setModelImageUrl(savedModel);
      setHistory([{ top: null, bottom: null, accessories: [], fullbody: null, resultImage: savedModel, pose: 'standing' }]);
      setHistoryIndex(0);
    }
  }, []);

  // Check for pending product from ProductDetail
  useEffect(() => {
    const pendingProductJson = localStorage.getItem('fitcheck_pending_product');
    if (pendingProductJson) {
      try {
        const product = JSON.parse(pendingProductJson);
        const category = product.category || detectCategory(product.name);

        const newItem = {
          id: `imported-${product.id}-${Date.now()}`,
          name: product.name,
          url: product.url,
          price: product.price,
          category: category
        };

        setWardrobe(prev => {
          const exists = prev.some(item => item.url === product.url);
          if (exists) return prev;
          return [newItem, ...prev];
        });

        localStorage.removeItem('fitcheck_pending_product');
      } catch (e) {
        console.error("Failed to parse pending product", e);
      }
    }
  }, []);

  const displayImageUrl = useMemo(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
      return history[historyIndex].resultImage;
    }
    return modelImageUrl;
  }, [history, historyIndex, modelImageUrl]);

  const activeGarmentIds = useMemo(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
      const current = history[historyIndex];
      const accIds = current.accessories?.map(a => a.id) || (current.accessory ? [current.accessory.id] : []);
      // Include fullbody ID if present
      const ids = [current.top?.id, current.bottom?.id, current.fullbody?.id, ...accIds].filter(Boolean);
      return ids;
    }
    return [];
  }, [history, historyIndex]);

  const handleModelFinalized = (url) => {
    setModelImageUrl(url);
    setHistory([{ top: null, bottom: null, accessories: [], fullbody: null, resultImage: url, pose: 'standing' }]);
    setHistoryIndex(0);
    setCurrentOutfit({ top: null, bottom: null, accessories: [], fullbody: null });
  };

  const handleStartOver = () => {
    setModelImageUrl(null);
    setHistory([]);
    setHistoryIndex(-1);
    setCurrentOutfit({ top: null, bottom: null, accessories: [], fullbody: null });
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setCurrentPoseId('standing');
    setIsSheetCollapsed(false);

    clearAllFitCheckSession();
    localStorage.removeItem('fitcheck_current_session');
  };

  const handleGarmentSelect = useCallback(async (garmentFile, garmentInfo) => {
    if (!modelImageUrl || isLoading) return;

    const category = garmentInfo.category || detectCategory(garmentInfo.name);

    const newOutfit = { ...currentOutfit };
    
    // Ensure accessories array exists
    if (!newOutfit.accessories) newOutfit.accessories = [];

    // --- LOGIC EXCLUSION ---
    if (category === 'fullbody') {
        // If selecting fullbody, remove top and bottom
        newOutfit.fullbody = garmentInfo;
        newOutfit.top = null;
        newOutfit.bottom = null;
    } else if (category === 'bottom') {
        // If selecting bottom, remove fullbody
        newOutfit.bottom = garmentInfo;
        newOutfit.fullbody = null;
    } else if (category === 'accessory') {
        // Accessory logic remains same (toggle)
        const existsIdx = newOutfit.accessories.findIndex(a => a.id === garmentInfo.id);
        if (existsIdx >= 0) {
            newOutfit.accessories = newOutfit.accessories.filter((_, i) => i !== existsIdx);
        } else {
            newOutfit.accessories = [...newOutfit.accessories, garmentInfo];
        }
    } else {
        // Default to top. If selecting top, remove fullbody
        newOutfit.top = garmentInfo;
        newOutfit.fullbody = null;
    }

    // Check duplicate
    const currentAccIds = (currentOutfit.accessories || []).map(a => a.id).sort().join(',');
    const newAccIds = newOutfit.accessories.map(a => a.id).sort().join(',');

    if (currentOutfit.top?.id === newOutfit.top?.id &&
      currentOutfit.bottom?.id === newOutfit.bottom?.id &&
      currentOutfit.fullbody?.id === newOutfit.fullbody?.id &&
      currentAccIds === newAccIds) {
      setIsWardrobeModalOpen(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    // Build loading string
    const parts = [
        newOutfit.fullbody?.name,
        newOutfit.top?.name, 
        newOutfit.bottom?.name, 
        ...newOutfit.accessories.map(a => a.name)
    ].filter(Boolean);
    setLoadingMessage(`Đang thử: ${parts.join(' + ')}...`);

    setIsWardrobeModalOpen(false);

    try {
      const getBlob = async (item, fallbackFile = null) => {
          if (!item) return null;
          if (fallbackFile && item.id === garmentInfo.id) return fallbackFile;
          if (item.file instanceof Blob) return item.file;
          if (item.url) {
              try {
                  const res = await fetch(item.url);
                  const blob = await res.blob();
                  return blob;
              } catch (e) {
                  console.error(`Failed to fetch blob for ${item.name}`, e);
                  return null;
              }
          }
          return null;
      };

      const topBlob = await getBlob(newOutfit.top, garmentFile);
      const bottomBlob = await getBlob(newOutfit.bottom, garmentFile);
      const fullBodyBlob = await getBlob(newOutfit.fullbody, garmentFile);
      
      const accBlobs = [];
      if (newOutfit.accessories) {
          for (const acc of newOutfit.accessories) {
              const blob = await getBlob(acc, garmentFile);
              if (blob) accBlobs.push(blob);
          }
      }

      // Pass fullBodyBlob to service
      const resultUrl = await generateMixMatchImage(modelImageUrl, topBlob, bottomBlob, accBlobs, fullBodyBlob);

      const newHistoryItem = {
        top: newOutfit.top,
        bottom: newOutfit.bottom,
        accessories: newOutfit.accessories,
        fullbody: newOutfit.fullbody,
        resultImage: resultUrl,
        pose: 'standing'
      };

      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, newHistoryItem];
      });
      setHistoryIndex(prev => prev + 1);
      setCurrentOutfit(newOutfit);
      setCurrentPoseId('standing');

      // Update wardrobe to ensure item has category if not present
      setWardrobe(prev => {
        const existingIdx = prev.findIndex(item => item.id === garmentInfo.id);
        if (existingIdx >= 0) {
          if (prev[existingIdx].category === category) return prev; 
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], category };
          return updated;
        }
        return [{ ...garmentInfo, category }, ...prev];
      });

    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Phối đồ thất bại'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [modelImageUrl, currentOutfit, historyIndex, isLoading]);

  const handlePoseSelect = async (poseId) => {
    if (poseId === currentPoseId) return;
    if (!displayImageUrl || isLoading) return;

    const targetPrompt = POSE_PROMPTS[poseId];

    setIsLoading(true);
    setLoadingMessage(`Đang tạo dáng: ${poseId}...`);
    setError(null);

    try {
      const newPoseImage = await generatePoseVariation(displayImageUrl, targetPrompt);

      const currentHistory = history[historyIndex];
      const newHistoryItem = {
        ...currentHistory,
        resultImage: newPoseImage,
        pose: poseId
      };

      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, newHistoryItem];
      });
      setHistoryIndex(prev => prev + 1);

      setCurrentPoseId(poseId);

    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Tạo dáng thất bại'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRemoveItem = async (type, id = null) => {
    if (isLoading) return;
    
    const newOutfit = { ...currentOutfit };
    
    if (type === 'top') newOutfit.top = null;
    if (type === 'bottom') newOutfit.bottom = null;
    if (type === 'fullbody') newOutfit.fullbody = null;
    if (type === 'accessory' && id) {
        newOutfit.accessories = newOutfit.accessories.filter(a => a.id !== id);
    }
    
    setIsLoading(true);
    setLoadingMessage('Đang cập nhật...');
    
    try {
        const getBlob = async (item) => {
            if (!item) return null;
            if (item.file instanceof Blob) return item.file;
            if (item.url) {
                try {
                    const res = await fetch(item.url);
                    const blob = await res.blob();
                    return blob;
                } catch (e) {
                    return null;
                }
            }
            return null;
        };

        const topBlob = await getBlob(newOutfit.top);
        const bottomBlob = await getBlob(newOutfit.bottom);
        const fullBodyBlob = await getBlob(newOutfit.fullbody);
        const accBlobs = [];
        for(const acc of (newOutfit.accessories || [])) {
            const blob = await getBlob(acc);
            if(blob) accBlobs.push(blob);
        }

        const resultUrl = await generateMixMatchImage(modelImageUrl, topBlob, bottomBlob, accBlobs, fullBodyBlob);
        
        const newHistoryItem = {
            top: newOutfit.top,
            bottom: newOutfit.bottom,
            accessories: newOutfit.accessories,
            fullbody: newOutfit.fullbody,
            resultImage: resultUrl,
            pose: currentPoseId
        };
        
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, newHistoryItem];
        });
        setHistoryIndex(prev => prev + 1);
        setCurrentOutfit(newOutfit);
        
    } catch (err) {
        setError(getFriendlyErrorMessage(err, 'Không thể xóa trang phục'));
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevItem = history[historyIndex - 1];
      setHistoryIndex(prev => prev - 1);
      setCurrentOutfit({
        top: prevItem.top,
        bottom: prevItem.bottom,
        fullbody: prevItem.fullbody || null,
        accessories: prevItem.accessories || (prevItem.accessory ? [prevItem.accessory] : [])
      });
      setCurrentPoseId(prevItem.pose);
    }
  };

  const OutfitLayersDisplay = () => (
    <div className="flex flex-col gap-2 mb-4">
      <h2 className="text-xl font-serif tracking-wider text-gray-800 border-b border-gray-400/50 pb-2 mb-3">
        Đang Mặc
      </h2>
      {!currentOutfit.top && !currentOutfit.bottom && !currentOutfit.fullbody && (!currentOutfit.accessories || currentOutfit.accessories.length === 0) && (
        <p className="text-gray-500 text-sm italic">Chưa mặc gì (Model gốc)</p>
      )}

      {currentOutfit.fullbody && (
        <div className="flex items-center gap-3 bg-rose-50 p-2 rounded border border-rose-200 animate-fade-in">
          <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded uppercase w-16 text-center">Cả Bộ</span>
          <img src={currentOutfit.fullbody.url} className="w-10 h-10 object-cover rounded" alt="Fullbody" />
          <span className="text-sm truncate flex-1">{currentOutfit.fullbody.name}</span>
          <button onClick={() => handleRemoveItem('fullbody')} className="text-gray-400 hover:text-red-500 transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {currentOutfit.top && (
        <div className="flex items-center gap-3 bg-blue-50 p-2 rounded border border-blue-200 animate-fade-in">
          <span className="text-[10px] font-bold bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded uppercase w-16 text-center">Áo</span>
          <img src={currentOutfit.top.url} className="w-10 h-10 object-cover rounded" alt="Top" />
          <span className="text-sm truncate flex-1">{currentOutfit.top.name}</span>
          <button onClick={() => handleRemoveItem('top')} className="text-gray-400 hover:text-red-500 transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {currentOutfit.bottom && (
        <div className="flex items-center gap-3 bg-green-50 p-2 rounded border border-green-200 animate-fade-in">
          <span className="text-[10px] font-bold bg-green-200 text-green-800 px-1.5 py-0.5 rounded uppercase w-16 text-center">Quần</span>
          <img src={currentOutfit.bottom.url} className="w-10 h-10 object-cover rounded" alt="Bottom" />
          <span className="text-sm truncate flex-1">{currentOutfit.bottom.name}</span>
          <button onClick={() => handleRemoveItem('bottom')} className="text-gray-400 hover:text-red-500 transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {currentOutfit.accessories && currentOutfit.accessories.map((acc) => (
        <div key={acc.id} className="flex items-center gap-3 bg-purple-50 p-2 rounded border border-purple-200 animate-fade-in">
          <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded uppercase w-16 text-center">Phụ Kiện</span>
          <img src={acc.url} className="w-10 h-10 object-cover rounded" alt="Accessory" />
          <span className="text-sm truncate flex-1">{acc.name}</span>
          <button onClick={() => handleRemoveItem('accessory', acc.id)} className="text-gray-400 hover:text-red-500 transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const viewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  const XIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="flex h-screen mt-[100px] bg-[#fff7f3] overflow-hidden">
      {/* Sidebar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Right Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {!modelImageUrl ? (
              <motion.div
                key="start-screen"
                className="h-full flex items-center justify-center bg-[#fff7f3] p-6"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <StartScreen onModelFinalized={handleModelFinalized} />
              </motion.div>
            ) : (
              <motion.div
                key="main-app"
                className="flex h-full overflow-hidden"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* ===== Main Canvas ===== */}
                <div className="flex-1 flex items-center justify-center bg-gray-100 relative overflow-hidden p-6">
                  <div className="relative max-w-5xl w-full flex justify-center">
                    {displayImageUrl && (
                      <img
                        src={displayImageUrl}
                        alt="Result"
                        className="max-h-[75vh] object-contain rounded-xl shadow-lg bg-white"
                      />
                    )}

                    {/* Loading Overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                        <Spinner />
                        <span className="mt-4 text-lg font-medium text-gray-800 animate-pulse">
                          {loadingMessage}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                      onClick={handleUndo}
                      disabled={historyIndex <= 0 || isLoading}
                      className="px-4 py-2 bg-white text-gray-800 rounded-full shadow hover:bg-gray-50 disabled:opacity-50 font-medium flex items-center gap-2"
                    >
                      ↩ Hoàn tác
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="px-4 py-2 bg-gray-800 text-white rounded-full shadow hover:bg-gray-900 font-medium"
                    >
                      Mẫu mới
                    </button>
                  </div>
                </div>

                {/* ===== Right Panel ===== */}
                <aside
                  className={`w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl transition-transform duration-300 ${isSheetCollapsed
                      ? "translate-x-full absolute right-0 top-0 z-40"
                      : "translate-x-0 relative"
                    }`}
                >
                  <div className="p-4 border-b flex items-center justify-between bg-gray-50 shrink-0">
                    <h3 className="font-bold text-gray-700">Studio Phối Đồ</h3>
                    <button
                      onClick={() => setIsSheetCollapsed(true)}
                      className="md:hidden"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                        {error}
                      </div>
                    )}

                    <OutfitLayersDisplay />

                    <PosePanel
                      currentPose={currentPoseId}
                      onPoseSelect={handlePoseSelect}
                      isLoading={isLoading}
                    />

                    <div>
                      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-between">
                        <span>Tủ Đồ Của Bạn</span>
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {wardrobe.length} món
                        </span>
                      </h2>

                      <button
                        onClick={() => setIsWardrobeModalOpen(true)}
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                      >
                        + Thêm Trang Phục
                      </button>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal */}
      <WardrobeModal
        isOpen={isWardrobeModalOpen}
        onClose={() => setIsWardrobeModalOpen(false)}
        onGarmentSelect={handleGarmentSelect}
        activeGarmentIds={activeGarmentIds}
        isLoading={isLoading}
        wardrobe={wardrobe}
      />
    </div>

  );
}
