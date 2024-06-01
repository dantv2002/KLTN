import { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import features from '../../data/features.json';

const { Option } = Select;

const Consultation = ({ visible, hideModal }) => {
    const [categories, setCategories] = useState({});

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

    return (
        <div>
            <Modal
                title={<h1 className="text-2xl font-bold text-blue-700 text-center mb-4">Hỗ trợ trả lời triệu chứng</h1>}
                visible={visible}
                onCancel={hideModal}
                okText="Xem kết quả"
                cancelText="Thoát"
                okButtonProps={{ className: "bg-blue-700" }}
                cancelButtonProps={{ className: "bg-red-600"}}
                width={600}
            >
                {Object.keys(categories).map(category => (
                    <div key={category} className="mb-4">
                        <h2 className="text-sm font-bold">{category}</h2>
                        <Select
                            style={{ width: '100%' }}
                            placeholder={`Chọn triệu chứng thuộc ${category}`}
                        >
                            {categories[category].map(feature => (
                                <Option key={feature} value={feature}>{feature}</Option>
                            ))}
                        </Select>
                    </div>
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
