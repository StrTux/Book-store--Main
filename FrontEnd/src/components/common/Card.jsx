import React from "react";
import { FaHeart, FaRetweet, FaComment, FaShare } from "react-icons/fa";
import '@styles/feedback.css';

const Card = ({
  profileImage,
  image,
  imageAlt,
  name,
  handle,
  tweet,
  content,
  title,
  timestamp,
  className = "",
  style = "twitter"
}) => {
  // Twitter style card
  if (style === "twitter") {
    return (
      <div
        className={`bg-white border border-gray-300 rounded-lg p-4 shadow-md w-full ${className}`}
      >
        <div className="flex space-x-3">
          {/* Profile Image */}
          <img
            src={profileImage || image}
            alt={name}
            className="w-12 h-12 rounded-full border border-gray-400"
          />

          {/* Tweet Content */}
          <div className="flex-1">
            {/* Name and Handle */}
            <div className="flex items-center space-x-2">
              <span className="poppins-medium font-bold text-black">{name}</span>
              <span className="poppins-light text-gray-500">@{handle || name.toLowerCase().replace(/\s/g, '')}</span>
            </div>

            {/* Tweet Text */}
            <p className="poppins-regular text-black mt-1">{tweet || content}</p>

            {/* Timestamp */}
            <div className="text-gray-500 text-sm mt-2">{timestamp || "Just now"}</div>

            {/* Twitter-like Icons */}
            <div className="flex justify-between text-gray-500 mt-3 text-sm">
              <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
                <FaComment />
                <span>1</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-green-500">
                <FaRetweet />
                <span>2</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500">
                <FaHeart />
                <span>3</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-400">
                <FaShare />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Basic card (original implementation)
  return (
    <div 
      className={`bg-black border border-gray-600 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
    >
      {image && (
        <div className="flex justify-center mb-4">
          <img
            src={image}
            alt={imageAlt || title}
            className="w-24 h-24 rounded-full border-2 border-gray-500 hover:border-indigo-500 transition-colors"
          />
        </div>
      )}
      
      {title && (
        <h4 className="text-lg text-center text-white font-bold mb-2">
          {title}
        </h4>
      )}
      
      {content && (
        <p className="text-white text-sm">
          {content}
        </p>
      )}
    </div>
  );
};

export default Card;
