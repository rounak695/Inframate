'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { issuesApi } from '@/lib/api-client';

interface FileUploaderProps {
    onUploadComplete: (urls: string[]) => void;
    maxFiles?: number;
}

export function FileUploader({ onUploadComplete, maxFiles = 3 }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (files.length + newFiles.length > maxFiles) {
                alert(`You can only upload up to ${maxFiles} files.`);
                return;
            }
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        const urls: string[] = [];

        try {
            for (const file of files) {
                // 1. Get presigned URL (or mock URL)
                const { uploadUrl, publicUrl } = await issuesApi.getUploadUrl(file.name, file.type);

                // 2. Upload to S3/R2
                await axios.put(uploadUrl, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                urls.push(publicUrl);
            }

            setUploadedUrls(prev => [...prev, ...urls]);
            onUploadComplete([...uploadedUrls, ...urls]); // Pass all URLs to parent
            setFiles([]); // Clear queue
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload files. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || uploadedUrls.length >= maxFiles}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Images
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                />
                <span className="text-xs text-muted-foreground">
                    {uploadedUrls.length}/{maxFiles} attached
                </span>
            </div>

            {/* Queue */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-2 border rounded bg-muted/50">
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => removeFile(i)}
                                disabled={uploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Selected'
                        )}
                    </Button>
                </div>
            )}

            {/* Uploaded List */}
            {uploadedUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {uploadedUrls.map((url, i) => (
                        <div key={i} className="relative group border rounded overflow-hidden aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Attachment" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                <FileIcon className="text-white h-6 w-6" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
