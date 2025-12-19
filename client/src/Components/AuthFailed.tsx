export function AuthFailed() {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg">You do not have permission to view this page.</p>
        </div>
    );
}