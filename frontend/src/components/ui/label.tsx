import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    // Since we haven't installed @radix-ui/react-label (I should install it for correctness, but for now I can render a primitive label if I wanted to avoid installs, 
    // but to follow instructions properly I will try to use the primitive if user has it or just update next step to install it. 
    // Wait, I should implement the install step to be safe. I'll do that in a parallel step or use a simple HTML label for now to be fast and dependency-free if possible, 
    // but shadcn components rely on radix primitives.
    // I will write the code assuming I will run the turbo install command next or just replace it with a standard label for speed if I don't want to add deps.
    // Actually, standard label is fine for now to avoid too many small installs, but let's stick to the prompt "use shadcn conventions".
    // I'll install @radix-ui/react-label next.
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
