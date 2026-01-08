import React from 'react';
import type { FooterLink } from '../pages/Footer';

const Footer = () => {
    const links: FooterLink[] = [
        { name: 'Privacy policy', href: '/PrivacyPolicy' },
        { name: 'Term of service', href: '/TermsOfService' },
        { name: 'Contact us', href: '/Contact' },
    ]
    return (
        <footer className='mt-6'>
            {/* Afficher chaque lien en utilisant map() */}
            <nav className='flex flex-wrap justify-center pb-4 gap-8'>
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className='text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm font-medium'
                    >
                        {link.name}
                    </a>
                ))}
            </nav>

            {/* Copyright */}
            <p className="text-gray-600 text-xs text-center">
                &copy; {new Date().getFullYear()} CookShare. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer