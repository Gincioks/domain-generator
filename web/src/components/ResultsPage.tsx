import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiGlobe } from 'react-icons/fi';

interface DomainResult {
    domain_name: string;
    domain_tld: string;
    explain: string;
    logo_description: string;
    label: {
        text: string | null;
        class: string | null;
    };
    product: {
        product_slug: string;
        price: {
            old: number;
            purchase: number;
            discount: number;
            billing_period: {
                period: number;
                period_unit: string;
            };
        };
    };
    multi_year_deal: boolean;
}

interface ResultsPageProps {
    results: DomainResult[];
}

const ResultsPage: React.FC<ResultsPageProps> = ({ results }) => {
    const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResults = results.filter(result =>
        result.domain_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-12">
                    Generated Domain Names
                </h1>

                <div className="mb-8">
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search domains..."
                                className="w-full py-3 px-4 pr-10 rounded-full border-2 border-indigo-300 focus:outline-none focus:border-indigo-500 transition duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500" size={20} />
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredResults.map((result, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <div
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                                onClick={() => setSelectedDomain(result)}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-indigo-700">{result.domain_name}</h2>
                                        {index === 0 && (
                                            <span className="bg-yellow-400 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                                                <FiStar className="mr-1" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-4">{result.explain}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiGlobe className="mr-2" />
                                        <span>{result.domain_tld}</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex justify-between items-center">
                                    <span className="text-white font-bold text-xl">
                                        ${result.product.price.purchase}/{result.product.price.billing_period.period_unit}
                                    </span>
                                    {result.product.price.discount > 0 && (
                                        <span className="bg-green-400 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                            Save {result.product.price.discount}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {selectedDomain && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedDomain(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-800">{selectedDomain.domain_name}</h2>
                            <p className="text-gray-600 mb-6">{selectedDomain.explain}</p>
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Logo Idea</h3>
                                <p className="text-gray-600 mb-4">{selectedDomain.logo_description}</p>
                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-500">Logo placeholder</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-6 flex justify-between items-center">
                            <div>
                                <span className="text-4xl font-bold text-white">
                                    ${selectedDomain.product.price.purchase}
                                </span>
                                <span className="text-indigo-200 ml-2">
                                    /{selectedDomain.product.price.billing_period.period_unit}
                                </span>
                            </div>
                            <button className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition-colors duration-300">
                                Purchase
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ResultsPage;