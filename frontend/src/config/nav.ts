import {
    ClipboardList,
    PlusCircle,
    BarChart,
    Users,
    Tags,
    Building2,
    Home
} from "lucide-react"

export type NavItem = {
    name: string
    href: string
    icon: any
}

export type RoleNavConfig = {
    [key: string]: NavItem[]
}

export const navigationConfig: RoleNavConfig = {
    STUDENT: [
        { name: 'My Issues', href: '/student', icon: ClipboardList },
        { name: 'Create Issue', href: '/student/create', icon: PlusCircle },
    ],
    STAFF: [
        { name: 'Assigned to Me', href: '/staff', icon: ClipboardList },
        { name: 'All Issues', href: '/staff/issues', icon: BarChart },
    ],
    ADMIN: [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'All Issues', href: '/admin/issues', icon: ClipboardList },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Categories', href: '/admin/categories', icon: Tags },
    ],
    SUPER_ADMIN: [
        { name: 'All Campuses', href: '/admin/campuses', icon: Building2 },
        { name: 'All Issues', href: '/admin/issues', icon: ClipboardList },
    ],
}
