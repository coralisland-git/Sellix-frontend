import React from "react";
import backIcon from "assets/images/x.png";
import { FormGroup, Input, Label, Form } from "reactstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { Spin } from "components";
import { Button } from 'components';


const Forms = ({ gateway, sending, productInfo, handleSubmit, setCustomFields, reset }) => {

	let validationSchema = Yup.object().shape({ email: Yup.string().required('Email is required') })

	let customFields = []

	if(productInfo && productInfo.custom_fields) {
		customFields = JSON.parse(productInfo.custom_fields).custom_fields
	}

	return (
		<div className="p-3 pt-2 pb-2 mb-2">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h4 className="mt-2  grey">Checkout with {gateway}</h4>
				<img src={backIcon} width="15" className="mb-2" onClick={reset} style={{cursor: "pointer"}} alt={''}/>
			</div>

			<Formik initialValues={{ email: '' }} onSubmit={handleSubmit} validationSchema={validationSchema}>
				{({ handleSubmit, errors, touched, values, handleChange}) => (
					<Form onSubmit={handleSubmit}>
						<FormGroup className="mb-3">
							<Label htmlFor="email">Email</Label>
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
									<FormGroup className="mb-3" key={key}>
										<Label htmlFor="email">{field.name} <small className="font-italic">{!field.required && '(optional)'}</small></Label>
										<Input
											type="text"
											id="text"
											name="text"
											onChange={(e) => setCustomFields(field.name, e.target.value)}
											value={customFields[field.name]}
											placeholder={field.name}
											required={field.required}
										/>
									</FormGroup>
								)
							}

							if(field.type === 'number') {
								return (
									<FormGroup className="mb-3" key={key}>
										<Label htmlFor="number">{field.name} <small className="font-italic">{!field.required && '(optional)'}</small></Label>
										<Input
											type="number"
											id="number"
											name="number"
											onChange={(e) => setCustomFields(field.name, e.target.value)}
											value={customFields[field.name]}
											placeholder={field.name}
											required={field.required}
										/>
									</FormGroup>
								)
							}

							if(field.type === 'largetextbox') {
								return (
									<FormGroup className="mb-3" key={key}>
										<Label htmlFor="number">{field.name} <small className="font-italic">{!field.required && '(optional)'}</small></Label>
										<textarea className="form-control"
										          id='service_text'
										          name="service_text"
										          value={customFields[field.name]}
										          rows={5}
										          required={field.required}
										          onChange={(e) => setCustomFields(field.name, e.target.value)} />
									</FormGroup>
								)
							}

							if(field.type === 'checkbox') {
								return (
									<FormGroup className="mb-3" key={key}>
										<label className="custom-checkbox custom-control payment-checkbox">
											<input
												className="custom-control-input"
												type="checkbox"
												id="sk"
												name="SMTP-auth"
												checked={customFields[field.name] || false}
												onChange={(e) => setCustomFields(field.name, e.target.checked)}
											/>
											<label className="custom-control-label" htmlFor="sk">
												{field.name} <small className="font-italic">{!field.required && '(optional)'}</small>
											</label>
										</label>
									</FormGroup>
								)
							}
						})}

						<div className="text-center">
							<p className="text-center grey" style={{ fontSize: 12 }}>By continuing, you agree to our Terms of Serviceeee</p>
							<Button color="primary" type="submit" className="mr-auto ml-auto mt-2" disabled={sending}>{sending ? <Spin/> : 'Purchase'}</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default Forms;