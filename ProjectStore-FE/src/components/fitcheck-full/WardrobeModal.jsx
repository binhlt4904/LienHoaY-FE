/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Converted from TypeScript
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadCloudIcon, CheckCircleIcon, XIcon } from './icons';

// Helper to convert image URL to a File object
const urlToFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type;
  return new File([blob], filename, { type: mimeType });
};

export default function WardrobeModal({ isOpen, onClose, onGarmentSelect, activeGarmentIds, isLoading, wardrobe }) {
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'top', 'bottom', 'accessory'

  const handleGarmentClick = async (item) => {
    if (isLoading || activeGarmentIds.includes(item.id)) return;
    setError(null);
    try {
      const file = await urlToFile(item.url, `${item.id}.png`);
      onGarmentSelect(file, item);
    } catch (err) {
      setError('Không thể tải ảnh sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh.');
        return;
      }
      
      // Basic category guess for manual upload
      let category = 'top'; // default
      if (activeTab !== 'all') {
          category = activeTab;
      }

      const customGarmentInfo = {
        id: `custom-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        category: category 
      };
      onGarmentSelect(file, customGarmentInfo);
    }
  };

  const filteredWardrobe = wardrobe.filter(item => {
    if (activeTab === 'all') return true;
    // Handle cases where category might be missing or capitalized differently
    const itemCat = (item.category || 'top').toLowerCase();
    return itemCat === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'top', label: 'Áo (Top)' },
    { id: 'bottom', label: 'Quần/Váy (Bottom)' },
    { id: 'accessory', label: 'Phụ kiện' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-2xl font-serif tracking-wider text-gray-800">Thêm Sản Phẩm</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                <XIcon className="w-6 h-6"/>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-4 pb-0 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {filteredWardrobe.map((item) => {
                  const isActive = activeGarmentIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleGarmentClick(item)}
                      disabled={isLoading || isActive}
                      className="relative aspect-square border rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group disabled:opacity-60 disabled:cursor-not-allowed hover:border-blue-500"
                      aria-label={`Select ${item.name}`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-bold text-center p-1 line-clamp-2">{item.name}</p>
                      </div>
                      {/* Show category tag small */}
                      <div className="absolute top-1 right-1">
                          <span className={`block w-2 h-2 rounded-full ${
                              item.category === 'bottom' ? 'bg-green-500' : 
                              item.category === 'accessory' ? 'bg-purple-500' : 'bg-blue-500'
                          }`}></span>
                      </div>

                      {isActive && (
                        <div className="absolute inset-0 bg-blue-500/70 flex items-center justify-center">
                          <CheckCircleIcon className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
                <label htmlFor="custom-garment-upload" className={`relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-blue-500 hover:text-blue-600 cursor-pointer'}`}>
                  <UploadCloudIcon className="w-6 h-6 mb-1"/>
                  <span className="text-xs text-center">Tải lên</span>
                  <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
                </label>
              </div>
              {filteredWardrobe.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Chưa có món đồ nào trong danh mục này.</p>
              )}
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
