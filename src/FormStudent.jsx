import { Modal, Form, Input, Button } from 'antd';
import React, { useEffect } from 'react'

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

const FormStudent = ({ isOpen, onCancel, onFinish, form, studentEdit }) => {

    const validateAge = (_, value) => {
        const age = parseInt(value, 10);
        if (isNaN(age) || age < 0 || age > 99) {
            return Promise.reject('Age must be between 0 and 99');
        }
        return Promise.resolve();
    };

    useEffect(() => {
        form.setFieldsValue(studentEdit)
    }, [])

    return (
        <Modal title="Student" open={isOpen} onCancel={onCancel} maskClosable={false} footer={[]}>
            <Form
                {...layout}
                form={form}
                onFinish={(value) => onFinish(value)}
            >
                <Form.Item
                    label="Name"
                    name={['name']}
                    rules={[
                        { required: true, message: 'Please enter your name' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Age"
                    name={['age']}
                    rules={[
                        { required: true, message: 'Please enter your age' },
                        { validator: validateAge },
                    ]}
                >
                    <Input type='number' />
                </Form.Item>
                <Form.Item
                    label="Address"
                    name={['address']}
                    rules={[
                        { required: true, message: 'Please enter your address' },
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name={['phone']}
                    rules={[
                        { required: true, message: 'Please enter your phone' },
                        { pattern: /^(\+?84|0)(\d{9,10})$/, message: 'Invalid phone number format' }
                    ]}>
                    <Input type='phone' />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name={['email']}
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: "Invalid email format" }
                    ]}>
                    <Input type='email' />
                </Form.Item>
                <Form.Item className='submit-scope'>
                    <Button type="primary" htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FormStudent