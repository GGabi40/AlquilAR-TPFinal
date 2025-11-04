import { useState } from "react"
import React from 'react'

import { PropertyContext } from '../property.context';

const PropertyFormContextProvider = ({ children }) => {
    const [formData, setFormData] = useState({ location: {}, features: {}, images: [] })

    const updateSection = (section, data) => {
        setFormData((prev) => ({ ...prev, [section]: data }));
    }

  return (
    <PropertyContext.Provider value={{ formData, updateSection }}>
      { children }
    </PropertyContext.Provider>
  )
}

export default PropertyFormContextProvider