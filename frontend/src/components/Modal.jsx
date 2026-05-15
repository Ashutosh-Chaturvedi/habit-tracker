function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    )
}

export default Modal