'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { withAuth } from '@/components/with-auth';
import { FileUploader } from '@/components/file-uploader';
import { issuesApi, categoriesApi } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    AlertCircle,
    Wifi,
    Lightbulb,
    Droplets,
    Thermometer,
    Hammer,
    Armchair,
    Monitor,
    HelpCircle,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PRIORITIES = [
    { value: 'LOW', label: 'Low', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
];

function CreateIssuePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        location: string;
        priority: string;
        attachments: string[];
    }>({
        title: '',
        description: '',
        location: '',
        priority: 'MEDIUM',
        attachments: [],
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
            // Fallback could go here if needed
        }
    };

    const getCategoryIcon = (catName: string): any => {
        const map: Record<string, any> = {
            'Electrical': { icon: Lightbulb, color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
            'Plumbing': { icon: Droplets, color: 'text-blue-500 bg-blue-50 border-blue-200' },
            'Internet/Wi-Fi': { icon: Wifi, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
            'Air Conditioning': { icon: Thermometer, color: 'text-cyan-500 bg-cyan-50 border-cyan-200' },
            'Furniture': { icon: Armchair, color: 'text-orange-500 bg-orange-50 border-orange-200' },
            'Civil/Damage': { icon: Hammer, color: 'text-stone-500 bg-stone-50 border-stone-200' },
            'Computers/IT': { icon: Monitor, color: 'text-purple-500 bg-purple-50 border-purple-200' },
            'Other': { icon: HelpCircle, color: 'text-gray-500 bg-gray-50 border-gray-200' },
        };
        return map[catName] || { icon: HelpCircle, color: 'text-gray-500 bg-gray-50 border-gray-200' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedCategory) {
            setError('Please select a category');
            return;
        }

        setLoading(true);

        try {
            await issuesApi.create({
                ...formData,
                categoryId: selectedCategory
            });
            router.push('/student');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create issue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <DashboardLayout title="Report an Issue">
            <div className="max-w-3xl mx-auto">
                <Link href="/student" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}

                    {/* Step 1: Category Selection (Dynamic Grid) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">1. What kind of issue is it?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {categories.length === 0 ? (
                                    <div className="col-span-full py-8 text-center text-muted-foreground flex items-center justify-center">
                                        Loading categories...
                                    </div>
                                ) : (
                                    categories.map((cat) => {
                                        const { icon: Icon, color } = getCategoryIcon(cat.name);
                                        const isSelected = selectedCategory === cat.id;
                                        return (
                                            <div
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={cn(
                                                    "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-md",
                                                    isSelected
                                                        ? `ring-2 ring-primary border-primary bg-primary/5`
                                                        : "hover:border-primary/50 bg-card"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded-full mb-2", color)}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <span className="text-sm font-medium line-clamp-1">{cat.name}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 2: Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">2. Describe the problem</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Issue Summary</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g., AC not working in Lab 3"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location">Exact Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="e.g., Building A, 2nd Floor, Room 204"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Details</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Provide more details so we can fix it faster..."
                                    className="min-h-[100px]"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Priority Level</Label>
                                <div className="flex flex-wrap gap-2">
                                    {PRIORITIES.map((p) => (
                                        <div
                                            key={p.value}
                                            onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                                            className={cn(
                                                "cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                                                formData.priority === p.value
                                                    ? "ring-2 ring-offset-1 ring-black border-transparent shadow-sm scale-105"
                                                    : "border-transparent opacity-70 hover:opacity-100",
                                                p.color
                                            )}
                                        >
                                            {p.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Photos (Optional)</Label>
                                <FileUploader
                                    onUploadComplete={(urls) => setFormData(prev => ({ ...prev, attachments: urls }))}
                                    maxFiles={3}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" type="button" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} size="lg">
                                {loading ? 'Submitting...' : 'Submit Issue'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(CreateIssuePage, ['STUDENT', 'STAFF', 'ADMIN']);
