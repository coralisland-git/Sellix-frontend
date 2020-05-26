import React from "react";
import { FormGroup, Input, Label, Form } from "components/reactstrap";
import { Formik } from "formik";
import { Spin } from "components";
import { Button } from 'components';
import config from "constants/config";
import object from "yup/lib/object";
import string from "yup/lib/string";


const Yup = {
	object,
	string
}
const Forms = ({ gateway, customFieldsValues, sending, productInfo, handleSubmit, setCustomFields, reset, price, coupon }) => {

	let validationSchema = Yup.object().shape({ email: Yup.string().required('Email is required') })

	let customFields = []

	if(productInfo && productInfo.custom_fields) {
		customFields = JSON.parse(productInfo.custom_fields).custom_fields
	}

	return (
		<div className="p-3 pt-2 pb-2 mb-2">
			<p className="text-center select-payment mb-4">Email address for product delivery</p>
			<Formik initialValues={{ email: '' }} onSubmit={handleSubmit} validationSchema={validationSchema}>
				{({ handleSubmit, errors, touched, values, handleChange}) => (
					<Form onSubmit={handleSubmit}>
						<FormGroup className="mb-3 ml-3 mr-3">
							<Input
								type="text"
								id="email"
								name="email"
								onChange={handleChange}
								value={values.email}
								placeholder="Email to have the product sent to"
								className={errors.email && touched.email ? "is-invalid" : ""}
							/>
							{errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
						</FormGroup>

						{customFields.map((field, key) => {
							if(field.type === 'text') {
								return (
									<FormGroup className="mb-3 ml-3 mr-3" key={key}>
										<Label htmlFor="email">{field.name} <small className="font-italic">{!field.required && '(optional)'}</small></Label>
										<Input
											type="text"
											id="text"
											name="text"
											onChange={(e) => setCustomFields(field.name, e.target.value)}
											value={customFieldsValues[field.name]}
											placeholder={field.name}
											required={field.required}
										/>
									</FormGroup>
								)
							}

							if(field.type === 'number') {
								return (
									<FormGroup className="mb-3 ml-3 mr-3" key={key}>
										<Label htmlFor="number">{field.name} <small className="font-italic">{!field.required && '(optional)'}</small></Label>
										<Input
											type="number"
											id="number"
											name="number"
											onChange={(e) => setCustomFields(field.name, e.target.value)}
											value={customFieldsValues[field.name]}
											placeholder={field.name}
											required={field.required}
										/>
									</FormGroup>
								)
							}

							if(field.type === 'largetextbox') {
								return (
									<FormGroup className="mb-3 ml-3 mr-3" key={key}>
										<Label htmlFor="number">{field.name} <small className="font-italic">{!field.required && '(optional)'}</small></Label>
										<textarea className="form-control"
										          id='service_text'
										          name="service_text"
										          value={customFieldsValues[field.name]}
										          rows={5}
										          placeholder={field.name}
										          required={field.required}
										          onChange={(e) => setCustomFields(field.name, e.target.value)} />
									</FormGroup>
								)
							}

							if(field.type === 'checkbox') {
								return (
									<FormGroup className="mb-3 ml-3 mr-3" key={key}>
										<label className="custom-checkbox custom-control removebackground" htmlFor={`sk${field.name}`}>
											<input
												className="custom-control-input"
												type="checkbox"
												id={`sk${field.name}`}
												name={field.name}
												checked={customFieldsValues[field.name] || false}
												onChange={(e) => {
													setCustomFields(field.name, e.target.checked)
												}}
											/>
											<label className="custom-control-label" htmlFor={`sk${field.name}`}>
												{field.name} <small className="font-italic">{!field.required && '(optional)'}</small>
											</label>
										</label>
									</FormGroup>
								)
							}
						})}
						<div className="text-center mt-5 mb-5">
							<h3 className="price"><small className="currency">{config.CURRENCY_LIST[productInfo.currency]}</small>{price}</h3>
							{coupon && <s>{config.CURRENCY_LIST[productInfo.currency]}{coupon}</s>}
						</div>
						<div className="d-flex justify-content-center">
							<Button color="secondary back-btn" className="ml-2 mr-2 d-block mb-2" style={{maxWidth: 172, width: '100%'}} onClick={reset}>Back</Button>
							<Button color="primary" type="submit" className="mr-2 ml-2 mb-2" style={{maxWidth: 172, width: '100%'}} disabled={sending}>{sending ? <Spin/> : 'Pay'}</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default Forms;
