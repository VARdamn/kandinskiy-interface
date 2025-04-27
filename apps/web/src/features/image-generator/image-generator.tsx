import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Slider } from '@/shared/components/ui/slider';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/shared/components/ui/tooltip';
import { ImageIcon, Loader2, Info } from 'lucide-react';
import { styles } from './model';

export const ImageGenerator = () => {
    const [style, setStyle] = useState('');
    const [width, setWidth] = useState(1024);
    const [height, setHeight] = useState(1024);
    const [query, setQuery] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ query?: string; style?: string }>({});

    const handleGenerate = async () => {
        const newErrors: { query?: string; style?: string } = {};

        if (!style.trim()) {
            newErrors.style = 'Выберите стиль!';
        }

        if (!query.trim()) {
            newErrors.query = 'Введите характеристику картинки!';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        setImageUrl('');

        const payload = {
            userId: localStorage.getItem('userId'),
            type: 'GENERATE',
            style,
            width,
            height,
            numImages: 1,
            negativePromptDecoder: negativePrompt,
            generateParams: {
                query,
            },
        };

        try {
            setLoading(true);
            const res = await fetch('http://localhost:5000/api/images/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            const { imageId } = data;
            if (!imageId) throw Error('Invalid response');

            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`http://localhost:5000/api/images/status?id=${imageId}`, {
                        method: 'GET',
                    });
                    const { image } = await statusRes.json();

                    if (image) {
                        clearInterval(interval);
                        setImageUrl(image);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Ошибка при получении статуса:', error);
                }
            }, 5000);
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    return (
        <div className="flex max-w-3xl mx-auto p-6 space-x-6">
            <div className="flex-none w-[500px] space-y-6">
                <Card>
                    <CardContent className="space-y-4 p-6">
                        <div>
                            <Label className="mb-2">Стиль</Label>
                            <Select value={style} onValueChange={setStyle}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите стиль" />
                                </SelectTrigger>
                                <SelectContent>
                                    {styles.map((s) => (
                                        <SelectItem key={s.name} value={s.name}>
                                            <div className="flex items-center gap-2">
                                                <img src={s.image} alt={s.title} className="w-6 h-6 rounded object-cover" />
                                                <span>{s.title}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.style && <p className="text-sm text-red-500">{errors.style}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="mb-2">Ширина (px)</Label>
                                <Slider min={256} max={2048} step={64} value={[width]} onValueChange={([v]) => setWidth(v)} />
                                <div>{width}px</div>
                            </div>
                            <div>
                                <Label className="mb-2">Высота (px)</Label>
                                <Slider min={256} max={2048} step={64} value={[height]} onValueChange={([v]) => setHeight(v)} />
                                <div>{height}px</div>
                            </div>
                        </div>

                        <div>
                            <Label className="mb-2">Характеристика картинки</Label>
                            <Textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например, пушистый кот в очках" />
                            {errors.query && <p className="text-sm text-red-500">{errors.query}</p>}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Label>Негативный промпт</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Что <b>не</b> должно быть на изображении. Например: "кислотные цвета, шум, артефакты".
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Textarea value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Например, яркие цвета" />
                        </div>

                        <Button onClick={handleGenerate} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                            Сгенерировать изображение
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {imageUrl && (
                <div className="flex-none w-[500px] h-[500px]">
                    <Card>
                        <CardContent className="p-6 flex justify-center">
                            <img src={`data:image/png;base64,${imageUrl}`} alt="Generated result" className="rounded-2xl shadow-md w-full h-full object-cover" />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
