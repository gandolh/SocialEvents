'use client'
import React from 'react';
import FOG from 'vanta/dist/vanta.fog.min.js';
import * as THREE from 'three';
type CloudsBackgroundProps = {
    children?: React.ReactNode,
    className?: string,
}


const CloudsBackground = ({ children, className } : CloudsBackgroundProps) => {
    // vanta background seter
    const [vantaEffect, setVantaEffect] = React.useState(null)
    const myRef = React.useRef(null)
    React.useEffect(() => {

            if (!vantaEffect) {
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
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])

    return (<div ref={myRef} className={className}>
        {children}
    </div>);
}

export default CloudsBackground;