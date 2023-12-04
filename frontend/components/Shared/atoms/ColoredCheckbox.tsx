'use client'
import React from 'react';

type coloredCheckboxParams = {
    itemName: string;
    defaultChecked: boolean;
    onToggle: (itemName: string) => void;
    Color?: string;
}

const ColoredCheckbox = ({ itemName, defaultChecked, onToggle, Color }: coloredCheckboxParams ) => {
    const [checked, setChecked] = React.useState<boolean>(defaultChecked);
    React.useEffect(() => {
        onToggle(itemName);
    }, [checked]);

    return (
        <input
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
            type="checkbox"
            style={{accentColor: Color }}
            className="w-4 h-4" />);
}

export default ColoredCheckbox;