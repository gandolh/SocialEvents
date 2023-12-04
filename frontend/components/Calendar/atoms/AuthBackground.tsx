'use client'
import React from 'react';
import TOPOLOGY from 'vanta/dist/vanta.topology.min.js';
import p5 from 'p5';
type AuthBackgroundProps = {
    children?: React.ReactNode,
    className?: string,
}


const AuthBackground = ({ children, className } : AuthBackgroundProps) => {
    // vanta background seter
    const [vantaEffect, setVantaEffect] = React.useState(null)
    const myRef = React.useRef(null)
    React.useEffect(() => {

            if (!vantaEffect) {
                console.log('set vanta effect')
                setVantaEffect(TOPOLOGY({
                    el: myRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    p5: p5
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

export default AuthBackground;