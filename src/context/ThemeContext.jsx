import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserTheme, updateUserTheme } from "../services/themeService"; // Asegúrate de que las rutas sean correctas

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Definir temas predefinidos
    const themes = {
        light: {
            name: "light",
            primaryColor: '#750E97',
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            borderRadius: 4,
            fixed: false,
        },
        dark: {
            name: "dark",
            primaryColor: '#121212',
            backgroundColor: '#2E2E2E',
            textColor: '#FFFFFF',
            borderRadius: 4,
            fixed: true,
        },
        document: {
            name: "document",
            primaryColor: '#750E97',
            backgroundColor: '#F3F4F6',
            textColor: '#000000',
            borderRadius: 4,
            fixed: false,
        },
        blossom: {
            name: "blossom",
            primaryColor: '#ED4192',
            backgroundColor: '#FFE4E6',
            textColor: '#000000',
            borderRadius: 4,
            fixed: false,
        }
    };

    // Estado inicial del tema (tema "light" como predeterminado)
    const [theme, setTheme] = useState(themes.light);

    // Cargar el tema del usuario al montar el componente
    useEffect(() => {
        const loadUserTheme = async () => {
            try {
                const userThemeColor = await fetchUserTheme();
                
                if (!userThemeColor) {
                    // Si el color del tema es `null`, establecer el tema "document" como predeterminado
                    setTheme(themes.document);
                } else {
                    // Buscar un tema cuyo `primaryColor` coincida con `userThemeColor`
                    const selectedTheme = Object.values(themes).find(t => t.primaryColor === userThemeColor);
                    if (selectedTheme) {
                        setTheme(selectedTheme);
                    } else {
                        // Si no hay un tema que coincida exactamente, crea uno basado en "document"
                        setTheme({ ...themes.document, primaryColor: userThemeColor });
                    }
                }
            } catch (error) {
                console.error("Error al cargar el tema del usuario:", error);
                // En caso de error, usar el tema "document"
                setTheme(themes.document);
            }
        };

        loadUserTheme();
    }, []);

    // Aplicar el tema actual y guardar el color en el backend
    const applyTheme = (tempTheme) => {
        setTheme(tempTheme);
        updateUserTheme(tempTheme.primaryColor); // Guardar el color del tema en el backend
    };

    // Función para cambiar el tema basado en el nombre (predefinido)
    const setThemeByName = (themeName) => {
        const selectedTheme = themes[themeName];
        if (selectedTheme) setTheme(selectedTheme);
    };

    // Función para actualizar una propiedad específica del tema
    const updateThemeColor = (property, value) => {
        setTheme((prevTheme) => ({
            ...prevTheme,
            [property]: value,
        }));
    };

    return (
        <ThemeContext.Provider value={{ theme, setThemeByName, updateThemeColor, applyTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personalizado para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext);
