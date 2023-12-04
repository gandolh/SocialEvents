'use client'

import { ThemeProvider } from "next-themes";
const Providers = ({children} : PageWithChildren) => {
    return ( 
            <ThemeProvider enableSystem={false}>
                {children}
            </ThemeProvider>

     );
}
 
export default Providers;