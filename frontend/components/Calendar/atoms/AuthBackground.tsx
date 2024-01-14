'use client'
import React from 'react';
import * as THREE from 'three'
import FOG from 'vanta/dist/vanta.fog.min.js';
type AuthBackgroundProps = {
    children?: React.ReactNode,
    className?: string,
}


const AuthBackground = ({ children, className } : AuthBackgroundProps) => {
    // vanta background seter
    const [vantaEffect, setVantaEffect] = React.useState(null)
    const myRef = React.useRef(null)
    React.useEffect(() => {

            if ( typeof window !== 'undefined' && !vantaEffect) {
                console.log('set vanta effect')
                setVantaEffect(FOG({
                    el: myRef.current,
                    mouseControls: false,
                    touchControls: false,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0xf4faff,
                    midtoneColor: 0x2196f3,
                    lowlightColor: 0x1e293b,
                    baseColor: 0xffffff,
                    blurFactor: 0.70,
                    THREE: THREE
                }));
        }
        return () => {
            if ( typeof window !== 'undefined' &&  vantaEffect) (vantaEffect as any).destroy()
        }
    }, [vantaEffect])

    return (<div ref={myRef} className={className}>
        {children}
    </div>);
}

export default AuthBackground;