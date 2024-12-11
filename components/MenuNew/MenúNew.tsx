
// import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
// import dynamic from 'next/dynamic';
// import styles from './MenuNew.module.css';

// interface MenuItem {
//     Menu_Title: string;
//     Profile_Type: string;
//     Primary_Color: string;
//     Secondary_color: string;
//     Background_Image: string;
//     Item_Image: string;
//     Section: string;
//     Item_id: number;
//     Name: string;
//     Description: string;
//     Price: string;
//     hojas: { Hoja1: any[] }; // Aquí se agrega la propiedad hojas
// }

// interface MenuProps {
//     menuItems: MenuItem[];
//     namecompanies: string;
// }

// // Importación dinámica para los perfiles
// const profileComponents = {
//     profile_one: dynamic(() => import('../Profile/Profile1/Menuone')),
//     profile_two: dynamic(() => import('../Profile/Profile2/Menutwo')),
//     profile_three: dynamic(() => import('../Profile/Profile3/Menuthree')),
//     profile_fourd: dynamic(() => import('../Profile/Profile4/Menufourd')),
//     profile_five: dynamic(() => import('../Profile/Profile5/Menufive')),
//     profile_six: dynamic(() => import('../Profile/Profile6/Menusix')),
//     profile_seven: dynamic(() => import('../Profile/Profile7/Menuseven')),
//     profile_eight: dynamic(() => import('../Profile/Profile8/Menueight')),
//     profile_nine: dynamic(() => import('../Profile/Profile9/Menunine')),
//     profile_ten: dynamic(() => import('../Profile/Profile10/Menuten')),
//     profile_eleven: dynamic(() => import('../Profile/Profile11/Menueleven')),
//     profile_twelve: dynamic(() => import('../Profile/Profile12/Menutwelve')),
//     profile_thirteen: dynamic(() => import('../Profile/Profile13/Menuthirteen')),
//     profileE_one: dynamic(() => import('../Profile/ProfileE1/Ecomerceone')),
// };

// const MenuNew: React.FC<MenuProps | any> = ({ menuItems, namecompanies }) => {
//     const [menuData, setMenuData] = useState<MenuItem[]>([]);
//     const [profile, setSelectedProfile] = useState<string>('');
//     const [backgroundImages, setBackgroundImages] = useState<string | null>(null);

//     // Aprovechamos useMemo para evitar cálculos repetidos
//     const groupedSections = useMemo(() => {
//         if (menuData?.length > 0) {
//             return menuData.reduce((acc, item) => {
//                 acc[item.Section] = acc[item.Section] || [];
//                 acc[item.Section].push(item);
//                 return acc;
//             }, {} as Record<string, MenuItem[]>);
//         }
//         return {};
//     }, [menuData]);

//     // Uso de useLayoutEffect para cargar los datos solo cuando sea necesario
//     useLayoutEffect(() => {
//         const fetchMenuData = async () => {
//             try {
//                 const fetchedData = await new Promise<MenuItem[]>((resolve) =>
//                     setTimeout(() => resolve(menuItems?.hojas.Hoja1), 1)
//                 );
//                 setMenuData(fetchedData);
//                 if (fetchedData?.length > 0) {
//                     setSelectedProfile(fetchedData[0]?.Profile_Type || '');
//                 }
//             } catch (error) {
//                 console.error('Error fetching menu data:', error);
//                 setMenuData([]);
//             }
//         };

//         fetchMenuData();
//     }, [menuItems]);

//     useEffect(() => {
//         if (menuData?.length > 0) {
//             const backgroundImageUrl =
//                 `url(/foldercompanies/${namecompanies}/${menuData[0]?.Background_Image})` ||
//                 `url(/images/italia.jpg)`;
//             setBackgroundImages(backgroundImageUrl);
//         }
//     }, [menuData, namecompanies]);

//     // Renderizado condicional del componente dinámico
//     const SelectedProfileComponent = profileComponents[profile] || null;

//     return (
//         <div>
//             {profile && SelectedProfileComponent ? (
//                 <SelectedProfileComponent
//                     menuData={menuData}
//                     groupedSections={groupedSections}
//                     backgroundImages={backgroundImages}
//                     namecompanies={namecompanies}
//                 />
//             ) : (
//                 <p>Loading profile...</p>
//             )}
//         </div>
//     );
// };

// export default MenuNew;



import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
    hojas: { Hoja1: any[] };
}

interface MenuProps {
    menuItems: { hojas: { Hoja1: MenuItem[] } };
    namecompanies: string;
}

// Importación dinámica para los perfiles
const profileComponents = {
    profile_one: dynamic(() => import('../Profile/Profile1/Menuone')),
    profile_two: dynamic(() => import('../Profile/Profile2/Menutwo')),
    profile_three: dynamic(() => import('../Profile/Profile3/Menuthree')),
    profile_fourd: dynamic(() => import('../Profile/Profile4/Menufourd')),
    profile_five: dynamic(() => import('../Profile/Profile5/Menufive')),
    profile_six: dynamic(() => import('../Profile/Profile6/Menusix')),
    profile_seven: dynamic(() => import('../Profile/Profile7/Menuseven')),
    profile_eight: dynamic(() => import('../Profile/Profile8/Menueight')),
    profile_nine: dynamic(() => import('../Profile/Profile9/Menunine')),
    profile_ten: dynamic(() => import('../Profile/Profile10/Menuten')),
    profile_eleven: dynamic(() => import('../Profile/Profile11/Menueleven')),
    profile_twelve: dynamic(() => import('../Profile/Profile12/Menutwelve')),
    profile_thirteen: dynamic(() => import('../Profile/Profile13/Menuthirteen')),
    profileE_one: dynamic(() => import('../Profile/ProfileE1/Ecomerceone')),
};

const MenuNew: React.FC<MenuProps> = ({ menuItems, namecompanies }) => {
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    const [profile, setProfile] = useState<string>('');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    // Agrupamiento de secciones con useMemo
    const groupedSections = useMemo(() => {
        return menuData.reduce<Record<string, MenuItem[]>>((acc, item) => {
            acc[item.Section] = acc[item.Section] || [];
            acc[item.Section].push(item);
            return acc;
        }, {});
    }, [menuData]);

    // Cargar datos del menú
    useLayoutEffect(() => {
        const fetchMenuData = async () => {
            try {
                const data = menuItems?.hojas?.Hoja1 || [];
                setMenuData(data);

                // Configurar el perfil seleccionado
                if (data.length > 0) {
                    setProfile(data[0].Profile_Type || '');
                }
            } catch (error) {
                console.error('Error fetching menu data:', error);
                setMenuData([]);
            }
        };

        fetchMenuData();
    }, [menuItems]);

    // Configurar la imagen de fondo
         useEffect(() => {
             if (menuData?.length > 0) {
                 const backgroundImageUrl =
                     `url(/foldercompanies/${namecompanies}/${menuData[0]?.Background_Image})` ||
                     `url(/images/italia.jpg)`;
                     setBackgroundImage(backgroundImageUrl);
             }
         }, [menuData, namecompanies]);
    // Componente dinámico seleccionado
    const SelectedProfileComponent = profileComponents[profile] || null;

    return (
        <div className={styles.container}>
            {SelectedProfileComponent ? (
                <SelectedProfileComponent
                    menuData={menuData}
                    groupedSections={groupedSections}
                    backgroundImages={backgroundImage}
                    namecompanies={namecompanies}
                />
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default MenuNew;
