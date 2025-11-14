import RgUserLayout from "../components/RgUserLayout.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RgUserLearn = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    const [categories, setCategories] = useState<any[]>([]);

    // Fetch from backend
    useEffect(() => {
        fetch('/api/categories') // This will proxy to your backend
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    const navigate = useNavigate();

    return (
        <Layout>
            <div className="w-full flex flex-col items-center pb-[62px]">
                <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                    What do you want to <span className="text-[#DA1A32]">learn</span>?
                </p>

                {/* Category container */}
                <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px] mt-[88px]">
                    {categories.map(category => (
                        <div
                            key={category.categoryId}
                            className="w-[350px] flex flex-col items-center group cursor-pointer"
                            onClick={() => navigate(`/RgUserCat/${category.categoryId}`)}
                        >
                            <img
                                src={category.catImg}
                                alt={category.title}
                                className="w-full h-[237px] object-cover"
                            />
                            <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                                {category.title}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </Layout>
    );
};

export default RgUserLearn;
