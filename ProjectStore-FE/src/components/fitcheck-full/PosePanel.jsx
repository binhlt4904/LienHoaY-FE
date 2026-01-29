export default function PosePanel({ onPoseSelect, currentPose, isLoading }) {
  const poses = [
    { id: 'standing', name: 'Đứng Thẳng', icon: '🧍' },
    { id: 'handsonhips', name: 'Tay Chống Hông', icon: '🙆' },
    { id: 'turned', name: 'Góc Nghiêng 3/4', icon: '🕴️' },
    { id: 'side', name: 'Nhìn Nghiêng', icon: '👤' },
    { id: 'walking', name: 'Đi Bộ', icon: '🚶' },
    { id: 'jumping', name: 'Đang Nhảy', icon: '🏃' },
    { id: 'leaning', name: 'Dựa Tường', icon: '🧗' },
    { id: 'sitting', name: 'Ngồi', icon: '🪑' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-400/50 pb-2 mb-3 mt-6">Chọn Tư Thế</h4>
      
      <div className="grid grid-cols-2 gap-2">
        {poses.map(pose => (
          <button
            key={pose.id}
            onClick={() => onPoseSelect && onPoseSelect(pose.id)}
            disabled={isLoading || currentPose === pose.id}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
              currentPose === pose.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-2xl mb-1">{pose.icon}</div>
            <div className="text-xs font-medium text-gray-700 text-center">{pose.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
