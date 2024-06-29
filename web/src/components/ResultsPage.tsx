import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
    const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);

    const generateLogo = async (description: string) => {
        setGeneratedLogo(null);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGeneratedLogo(`https://via.placeholder.com/150?text=${encodeURIComponent(description.slice(0, 10))}`);
    };

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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Generated Domain Names</h1>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {results.map((result, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <div
                            className="bg-white rounded-lg shadow-md h-full cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            onClick={() => setSelectedDomain(result)}
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">{result.domain_name}</h2>
                                <p className="text-gray-600 mb-4">{result.explain}</p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                                <span className="text-indigo-600 font-bold text-lg">
                                    ${result.product.price.purchase}/year
                                </span>
                                {result.product.price.discount > 0 && (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                        Save {result.product.price.discount}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {selectedDomain && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedDomain(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h2 className="text-3xl font-bold mb-4">{selectedDomain.domain_name}</h2>
                            <p className="text-gray-600 mb-6">{selectedDomain.explain}</p>
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">Logo Idea</h3>
                                <p className="text-gray-600 mb-4">{selectedDomain.logo_description}</p>
                                {generatedLogo ? (
                                    <img src={generatedLogo} alt="Generated Logo" className="w-32 h-32 object-contain mx-auto" />
                                ) : (
                                    <button
                                        onClick={() => generateLogo(selectedDomain.logo_description)}
                                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                                    >
                                        Generate Logo
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <div>
                                <span className="text-3xl font-bold text-indigo-600">
                                    ${selectedDomain.product.price.purchase}
                                </span>
                                <span className="text-gray-500 ml-2">
                                    /{selectedDomain.product.price.billing_period.period_unit}
                                </span>
                            </div>
                            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full transition-colors">
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