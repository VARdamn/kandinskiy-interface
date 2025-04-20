import { ImageGenerator } from '@/features/image-generator/image-generator';


function App() {	
	return (
		<div className="min-h-screen flex items-center justify-center bg-muted">
		  <div className="w-full max-w-3xl p-6 space-y-6">
			<ImageGenerator />
		  </div>
		</div>
	);
}

export default App
