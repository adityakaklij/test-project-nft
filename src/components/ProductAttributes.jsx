import { useState } from "react";

// Since we don't have attributes in our simplified data model, 
// this is just a placeholder component
const ProductAttributes = ({ attributes = [], onChange = () => {} }) => {
    const [selected, setSelected] = useState({});

    const handleSelect = (attrName, value) => {
        const newSelected = { ...selected, [attrName]: value };
        setSelected(newSelected);
        onChange(newSelected);
    };
    
    return (
        <div className="flex flex-col gap-4 my-6">
            {attributes.map((attr) => (
                <div key={attr.name}>
                    <h4 className="font-bold font-roboto mb-2">{attr.name}:</h4>
                    <div className="flex gap-3 flex-wrap">
                        {attr.values && attr.values.map((val, i) => {
                            const isActive = selected[attr.name] === val;
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(attr.name, val)}
                                    className={`border-2 min-w-8 min-h-8 ${
                                        isActive ? "border-black" : "border-gray-300"
                                    }`}
                                >
                                    {val}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductAttributes;
