import { ImageGenerator } from '@/features/image-generator/image-generator';
import { v4 as uuid4 } from 'uuid';

function App() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        localStorage.setItem('userId', uuid4());
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
            <div className="w-full max-w-3xl p-6 space-y-6">
                <ImageGenerator />
            </div>
        </div>
    );
}

export default App;
