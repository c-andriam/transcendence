import React from 'react';
import type { FooterLink } from '../pages/Footer';

const Footer = () => {
    const links: FooterLink[] = [
        { name: 'Privacy policy', href: '/PrivacyPolicy' },
        { name: 'Term of service', href: '/TermsOfService' },
        { name: 'Contact us', href: '/Contact' },
    ]
    return (
        <footer>
            {/* Afficher chaque lien en utilisant map() */}
            <nav>
                {links.map((link) => (
                    <a
                        className='link link-hover'
                        key={link.href}
                        href={link.href}>
                        {link.name}
                        {link.href !== links[links.length - 1].href ? <span> | </span> : null}
                    </a>
                ))}
            </nav>
            <p>&copy; 2026 ft_transcendence. All rights reserved.</p>
        </footer>
    )
}

export default Footer