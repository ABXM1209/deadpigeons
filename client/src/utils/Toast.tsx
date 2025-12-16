// Toast.tsx

type ToastProps = {
    message: string;
    type: "success" | "error";
    onClose?: () => void;
};

export function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div className="toast toast-top toast-center z-50">
            <div
                className={`alert shadow-lg ${type === "success" ? "alert-success" : "alert-error"}`}
            >
                <span>{message}</span>
                <button className="btn btn-sm btn-ghost" onClick={onClose}>✕</button>
            </div>
        </div>
    );
}
