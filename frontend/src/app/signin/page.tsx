export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'rgb(29, 65, 101)' }}>
      <div className="p-10 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-lg font-medium mb-6 text-center">Sign in</h2>

        <a
          href="/dashboard"
          className="custom-btn flex items-center justify-center bg-gray-100 border border-gray-300 text-black font-bold py-2 px-4 rounded w-full"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
