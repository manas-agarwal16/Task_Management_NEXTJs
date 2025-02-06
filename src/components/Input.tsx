import React from 'react';

const Input = ({type="text" , className="" , ...props}) => {
    return (
        <div>
            <input type={type} className={`bg-gray-800 text-gray-300 p-2 text-sm ${className}`} {...props}/>
        </div>
    );
}

export default Input;
