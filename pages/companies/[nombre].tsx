import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { fetchData } from '../../servicesApi/fetch.services';
import { useDispatch } from 'react-redux';
import { setChExcelData } from '../../redux/slices/chExcelDataSlice';

// Importación dinámica de MenuNew con una imagen de fondo mientras se carga
const MenuNew = dynamic(() => import('../../components/MenuNew/MenúNew'), {
    loading: () => (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `url('/imagesflama.png')`, // Cambia esta ruta por tu imagen real
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>Cargando...</p>
        </div>
    ),
    ssr: false,
});

export default function EmpresaPage({ params }: { params: { id: string } }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [data, setExcelData] = useState<any | undefined>(undefined);
    const [namecompanies, setNameCompanies] = useState<string | undefined>(undefined);
    const [isLoaded, setIsLoaded] = useState(false); // Estado para manejar la animación

    // Memoizar los datos de la empresa para evitar cambios innecesarios
    const fetchExcelData = useMemo(() => {
        return async (nombre: string) => {
            const formData = {
                folder: nombre,
                file: `${nombre}.xlsx`,
            };

            try {
                const response = await fetchData(formData, 'POST', '/api/readFile');
                if (response.ok) {
                    dispatch(setChExcelData(response));
                    setExcelData(response?.data);
                    setIsLoaded(true); // Activa el estado cuando los datos están listos
                } else {
                    dispatch(
                        setChExcelData({
                            ok: false,
                            data: null,
                            error: response.error,
                            message: response.message,
                        })
                    );
                    console.error('Error al obtener los datos:', response.error || response.message);
                    router.push('/notfound'); // Redirige a la página de "No encontrado"
                }
            } catch (error) {
                console.error('Error en fetchExcelData:', error);
                router.push('/notfound'); // Redirige si ocurre un error
            }
        };
    }, [dispatch, router]);

    useEffect(() => {
        if (router.isReady) {
            const nombre = router.query.nombre as string;
            setNameCompanies(nombre);
            if (nombre && !data) {
                fetchExcelData(nombre); // Solo hace la petición si no hay datos previamente
            }
        }
    }, [router.isReady, router.query.nombre, fetchExcelData, data]);

    return (
        <Layout>
            <div className={isLoaded ? 'fade-in' : ''}>
                <MenuNew menuItems={data} namecompanies={namecompanies} />
            </div>
        </Layout>
    );
}
