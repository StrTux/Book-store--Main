import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/common";
import { format } from 'date-fns';
import '@styles/feedback.css';

const generateRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const feedbackData = [
    {
        id: 1,
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        feedback: "Great selection of books! I found exactly what I was looking for.",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 2,
        name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        feedback: "Love the cozy atmosphere and friendly staff!",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 3,
        name: "Alice Brown",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        feedback: "I love browsing here. The latest releases are always in stock.",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 4,
        name: "Robert Lee",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        feedback: "Amazing collection of science fiction books.",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 5,
        name: "Michael Johnson",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        feedback: "The online store is easy to navigate, and the delivery was prompt.",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 6,
        name: "Sophia Davis",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        feedback: "A wide variety of genres, great for all ages!",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 7,
        name: "David Wilson",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        feedback: "Love the bookstore! Excellent atmosphere and great reading nooks.",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 8,
        name: "Emma White",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        feedback: "Great customer service! They recommended a perfect book for me.",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 9,
        name: "James Taylor",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        feedback: "Always find the best books here, highly recommend it!",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    },
    {
        id: 10,
        name: "Olivia Harris",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        feedback: "Fantastic range of novels, both new and old!",
        timestamp: format(generateRandomDate(), 'MMM d, yyyy')
    }

];

const Feedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedbackText: '',
        rating: 5
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', formData);
        // Here you would typically send this data to your backend
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                feedbackText: '',
                rating: 5
            });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <MainLayout>
            <div className="flex flex-col items-center p-10">
                <h1 className="dancing-script mt-10 mb-10 text-3xl font-semibold text-black mb-10">Customer Feedback</h1>

                {/* Feedback Display Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-16">
                    {feedbackData.map(({ id, name, image, feedback, timestamp }) => (
                        <Card
                            key={id}
                            profileImage={image}
                            name={name}
                            tweet={feedback}
                            timestamp={timestamp}
                            style="twitter"
                            className="transition-all duration-300 hover:shadow-lg"
                        />
                    ))}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent my-12"></div>

                {/* Feedback Form Section */}
                <div className="w-full max-w-4xl mt-10">
                    <h2 className="text-2xl font-semibold text-black mb-8 text-center">Share Your Experience</h2>

                    <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-8 shadow-md">
                        {submitted ? (
                            <div className="text-green-600 text-center p-6">
                                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                                <p>Your feedback has been submitted successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="poppins-light block text-black text-sm font-medium mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-400 text-black px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="poppins-light block text-black text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-400 text-black px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="rating" className="block text-black text-sm font-medium mb-2">
                                        Rating (1-5 stars)
                                    </label>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className="mr-1 focus:outline-none"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill={star <= formData.rating ? "#F59E0B" : "none"}
                                                    stroke={star <= formData.rating ? "none" : "#F59E0B"}
                                                    className="w-8 h-8"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                    />
                                                </svg>
                                            </button>
                                        ))}
                                        <span className="ml-2 text-black">({formData.rating}/5)</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="feedbackText" className="poppins-light block text-black text-sm font-medium mb-2">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        id="feedbackText"
                                        name="feedbackText"
                                        value={formData.feedbackText}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-400 text-black px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 min-h-[150px] resize-y"
                                        placeholder="Share your experience with our bookstore..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="poppins-light  bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-300"
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Feedback;
