'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HouseFormData, FormErrors } from '@/types/house';
import { Home, Bed, Bath, ChefHat, MapPin, FileText } from 'lucide-react';

interface HouseDesignFormProps {
  onSubmit: (formData: HouseFormData) => void;
  isLoading: boolean;
}

/**
 * House Design Form Component
 * Collects user specifications for house design
 */
export default function HouseDesignForm({ onSubmit, isLoading }: HouseDesignFormProps) {
  const [formData, setFormData] = useState<HouseFormData>({
    plotSize: '',
    houseType: 'single',
    bedrooms: 2,
    bathrooms: 1,
    kitchens: 1,
    locationType: 'city',
    extraNotes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate plot size
    if (!formData.plotSize.trim()) {
      newErrors.plotSize = 'Plot size is required';
    } else {
      const plotSize = formData.plotSize.toLowerCase().replace(/\s/g, '');
      if (!plotSize.match(/^\d+x\d+$|^\d+$/)) {
        newErrors.plotSize = 'Please enter plot size as "width x length" or single dimension';
      }
    }

    // Validate room counts
    if (formData.bedrooms < 1 || formData.bedrooms > 10) {
      newErrors.bedrooms = 'Bedrooms must be between 1 and 10';
    }

    if (formData.bathrooms < 1 || formData.bathrooms > 5) {
      newErrors.bathrooms = 'Bathrooms must be between 1 and 5';
    }

    if (formData.kitchens < 1 || formData.kitchens > 3) {
      newErrors.kitchens = 'Kitchens must be between 1 and 3';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof HouseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Design Your Dream House
        </h2>
        <p className="text-gray-600">
          Fill in the details below and our AI will generate a custom 3D house layout for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plot Size */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4" />
            Plot Size
          </label>
          <input
            type="text"
            value={formData.plotSize}
            onChange={(e) => handleInputChange('plotSize', e.target.value)}
            placeholder="e.g., 20x30 or 25 (in meters)"
            className={`form-input ${errors.plotSize ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {errors.plotSize && (
            <p className="text-red-500 text-sm">{errors.plotSize}</p>
          )}
          <p className="text-xs text-gray-500">
            Enter dimensions as "width x length" or single dimension for square plots
          </p>
        </div>

        {/* House Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Home className="w-4 h-4" />
            House Type
          </label>
          <select
            value={formData.houseType}
            onChange={(e) => handleInputChange('houseType', e.target.value as 'single' | 'double')}
            className="form-select"
            disabled={isLoading}
          >
            <option value="single">Single Story</option>
            <option value="double">Double Story</option>
          </select>
        </div>

        {/* Room Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Bed className="w-4 h-4" />
              Bedrooms
            </label>
            <select
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
              className={`form-select ${errors.bedrooms ? 'border-red-500' : ''}`}
              disabled={isLoading}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {errors.bedrooms && (
              <p className="text-red-500 text-sm">{errors.bedrooms}</p>
            )}
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Bath className="w-4 h-4" />
              Bathrooms
            </label>
            <select
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
              className={`form-select ${errors.bathrooms ? 'border-red-500' : ''}`}
              disabled={isLoading}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {errors.bathrooms && (
              <p className="text-red-500 text-sm">{errors.bathrooms}</p>
            )}
          </div>

          {/* Kitchens */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ChefHat className="w-4 h-4" />
              Kitchens
            </label>
            <select
              value={formData.kitchens}
              onChange={(e) => handleInputChange('kitchens', parseInt(e.target.value))}
              className={`form-select ${errors.kitchens ? 'border-red-500' : ''}`}
              disabled={isLoading}
            >
              {[1, 2, 3].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {errors.kitchens && (
              <p className="text-red-500 text-sm">{errors.kitchens}</p>
            )}
          </div>
        </div>

        {/* Location Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4" />
            Location Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="locationType"
                value="city"
                checked={formData.locationType === 'city'}
                onChange={(e) => handleInputChange('locationType', e.target.value as 'city' | 'village')}
                className="mr-3"
                disabled={isLoading}
              />
              <div>
                <div className="font-medium text-gray-800">City</div>
                <div className="text-sm text-gray-600">Modern furnished style</div>
              </div>
            </label>
            
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="locationType"
                value="village"
                checked={formData.locationType === 'village'}
                onChange={(e) => handleInputChange('locationType', e.target.value as 'city' | 'village')}
                className="mr-3"
                disabled={isLoading}
              />
              <div>
                <div className="font-medium text-gray-800">Village</div>
                <div className="text-sm text-gray-600">Simple but stylish style</div>
              </div>
            </label>
          </div>
        </div>

        {/* Extra Notes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4" />
            Extra Notes (Optional)
          </label>
          <textarea
            value={formData.extraNotes}
            onChange={(e) => handleInputChange('extraNotes', e.target.value)}
            placeholder="Any additional requirements or preferences..."
            rows={3}
            className="form-input resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="loading-spinner"></div>
              <span>Generating House Design...</span>
            </div>
          ) : (
            'Generate 3D House Design'
          )}
        </motion.button>
      </form>

      {/* Form Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Design Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• City style includes modern furniture and contemporary design</li>
          <li>• Village style features traditional elements with warm colors</li>
          <li>• Plot size affects overall house dimensions and room sizes</li>
          <li>• More rooms will be arranged efficiently within the available space</li>
        </ul>
      </div>
    </motion.div>
  );
}


