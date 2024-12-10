import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import styles from './MenuNew.module.css';

interface MenuItem {
    Menu_Title: string;
    Profile_Type: string;
    Primary_Color: string;
    Secondary_color: string;
    Background_Image: string;
    Item_Image: string;
    Section: string;
    Item_id: number;
    Name: string;
    Description: string;
    Price: string;
}

interface MenuProps {
    namecompanies: string;
    groupedSections: Record<string, MenuItem[]>;
    menuData: any;
    backgroundImages?: string;
}

const Menuten: React.FC<MenuProps> = ({ groupedSections, namecompanies, backgroundImages }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

    // UseEffect for debounce behavior
    const debounceSearch = useCallback(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    React.useEffect(() => {
        debounceSearch();
    }, [debounceSearch]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Filter sections only if necessary and return early if there's no search term
    const filteredSections = useMemo(() => {
        if (!debouncedSearchTerm.trim()) return groupedSections;  // If search term is empty, return all sections

        const filtered: Record<string, MenuItem[]> = {};
        Object.entries(groupedSections).forEach(([sectionName, items]) => {
            const filteredItems = items.filter(item =>
                [item.Name, item.Menu_Title, item.Description, item.Price]
                    .some(field => field.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            );
            if (filteredItems.length) filtered[sectionName] = filteredItems;
        });
        return filtered;
    }, [debouncedSearchTerm, groupedSections]);

    return (
        <div
            className={styles.menuContainer}
            style={{
                backgroundImage: backgroundImages || 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <header className={styles.header}>
                <h1 className={styles.mainTitle}>{namecompanies}</h1>
                <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                    aria-label="Search menu items"
                />
            </header>

            <div className={styles.menuWrapper}>
                {Object.entries(filteredSections).length > 0 ? (
                    Object.entries(filteredSections).map(([sectionName, items]) => (
                        <div key={sectionName} className={styles.section}>
                            <h2 className={styles.sectionTitle}>{sectionName}</h2>
                            <div className={styles.sectionItems}>
                                {items.map(item => (
                                    <div
                                        key={item.Item_id}
                                        className={styles.menuItem}
                                    >
                                        <div className={styles.itemImage}>
                                            <Image
                                                src={`/foldercompanies/${namecompanies}/${item.Item_Image}`}
                                                alt={item.Name}
                                                width={50}
                                                height={50}
                                                className={styles.image}
                                            />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h3 className={styles.itemName}> {item.Name}</h3>
                                            <p className={styles.itemDescription}>{item.Description}</p>
                                            <span className={styles.price}>${item.Price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noResults}>No results found for "{searchTerm}"</p>
                )}
            </div>
        </div>
    );
};

export default Menuten;
