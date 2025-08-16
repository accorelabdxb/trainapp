// lib/icons/iconWithClassName.ts
// (You can also name it utils/iconWithClassName.ts or components/icons/iconWithClassName.ts)

import type { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

/**
 * A utility function to enable Tailwind CSS className prop for Lucide icons.
 * This maps 'className' to 'style' and specifically handles 'color' and 'opacity'
 * properties from Tailwind classes (e.g., text-red-500, opacity-50) directly.
 *
 * @param icon The LucideIcon component to wrap.
 */
export function iconWithClassName(icon: LucideIcon) {
    cssInterop(icon, {
        className: {
            target: 'style',
            nativeStyleToProp: {
                color: true,   // Allows 'text-COLOR' classes to set the icon's color
                opacity: true, // Allows 'opacity-VALUE' classes to set the icon's opacity
            },
        },
    });
}