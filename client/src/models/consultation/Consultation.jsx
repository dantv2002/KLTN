import { useEffect, useState } from 'react';
import { Modal, Select, message } from 'antd';
import PropTypes from 'prop-types';
import features from '../../data/features.json';
import { consultation } from '../../Api';
import axios from 'axios';

const { Option } = Select;

const Consultation = ({ visible, hideModal }) => {
    const [categories, setCategories] = useState({});
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [result, setResult] = useState("");
    const [visibleResult, setVisibleResult] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const categorizedFeatures = features.reduce((acc, feature) => {
            const { category, feature_VI } = feature;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(feature_VI);
            return acc;
        }, {});

        setCategories(categorizedFeatures);
    }, []);

    const handleChange = (value, category) => {
        const selectedEN = features
            .filter(f => value.includes(f.feature_VI))
            .map(f => f.feature_EN);

        setSelectedFeatures(prev => ({
            ...prev,
            [category]: selectedEN
        }));
    };

    const handleSubmit = async() => {
        const symptoms = Object.values(selectedFeatures).flat();
        console.log(symptoms);
        setLoading(true);
        try {
            let response = await axios.post(consultation, {
                Symptoms: symptoms
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                setResult(response.data.Data);
                setVisibleResult(true);
            }
        }catch(error){
            message.error(error.response.data.Message)
        } finally {
            setLoading(false);
        }
    }

    const handleCancelResult = () => {
        setVisibleResult(false);
        setResult("");
    }

    return (
        <div>
            <Modal
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Chẩn đoán sơ bộ</h1>}
                visible={visible}
                onCancel={hideModal}
                onOk={handleSubmit}
                okText="Xem kết quả"
                cancelText="Thoát"
                okButtonProps={{ className: "bg-blue-700", loading: loading }}
                cancelButtonProps={{ className: "bg-red-600" }}
                width={600}
            >
                {Object.keys(categories).map(category => (
                    <div key={category} className="mb-4">
                        <h2 className="text-sm font-bold">{category}</h2>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder={`Chọn triệu chứng thuộc ${category}`}
                            onChange={(value) => handleChange(value, category)}
                        >
                            {categories[category].map(feature => (
                                <Option key={feature} value={feature}>{feature}</Option>
                            ))}
                        </Select>
                    </div>
                ))}
            </Modal>
            <Modal
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Kết quả</h1>}
                visible={visibleResult}
                onCancel={handleCancelResult}
                cancelText="Thoát"
                okButtonProps={{ hidden: true }}
                cancelButtonProps={{ className: "bg-red-600" }}
                width={500}
            >
                {Object.keys(result).map(key => (
                    <p key={key} className="font-rubik">
                        Dựa vào các triệu chứng mà bạn cung cấp, hệ thống cho ra kết quả là bệnh <strong className="font-bold text-red-500">{key}</strong> với độ chính xác <strong className="font-bold text-green-600">{result[key]}%</strong>.
                    </p>
                ))}
            </Modal>
        </div>
    );
};

Consultation.propTypes = {
    visible: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
};

export default Consultation;
