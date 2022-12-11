import React from "react";

interface TextInputProps {
    name: string;
    label: string;
    value: string;
    onChange: ( value: string ) => void;
    className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ name, label, value, onChange, className }) => {
    return (
        <div className={ className }>
            <label htmlFor={ name } className="block text-sm font-medium text-gray-300 py-2">{ label }</label>
            <input
                type="text"
                name={ name }
                className="h-10 px-2 border rounded-md bg-zinc-900 text-gray-200"
                value={ value }
                onChange={ e => onChange( e.target.value ) }
            />
        </div>
    );
}

export default TextInput;