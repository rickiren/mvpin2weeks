import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyModal = ({ isOpen, onClose }: CalendlyModalProps) => {
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Load Calendly script if not already loaded
      if (!window.Calendly) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = () => {
          if (window.Calendly && calendlyRef.current) {
            window.Calendly.initInlineWidget({
              url: 'https://calendly.com/rickibodner',
              parentElement: calendlyRef.current,
              prefill: {},
              utm: {}
            });
          }
        };
        document.head.appendChild(script);
      } else if (calendlyRef.current) {
        // Script already loaded, just initialize
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/rickibodner',
          parentElement: calendlyRef.current,
          prefill: {},
          utm: {}
        });
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Book Your 15-Minute Fit Call
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Calendly Widget */}
              <div className="p-4">
                <div 
                  ref={calendlyRef}
                  className="calendly-inline-widget" 
                  data-url="https://calendly.com/rickibodner" 
                  style={{ minWidth: "320px", height: "700px" }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CalendlyModal;
