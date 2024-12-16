import React, { useState } from 'react';

function AdmissionForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    course: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Clear errors when user changes input
    setErrors({
      ...errors,
      [name]: '',
    });
    if (name === 'fullName' && value.length > 1) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/suggestions?name=${value}`);
        const data = await response.json();
        setNameSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching name suggestions:', error);
      }
      setLoading(false);
    } else {
      setNameSuggestions([]); 
    }
  };
  

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{4}[0-9]{7}$/;
    return phoneRegex.test(phone);
  };

  // Validate email on blur
  const handleEmailBlur = () => {
    if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Please enter a valid email address.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: '',
      }));
    }
  };

  // Validate phone on blur
  const handlePhoneBlur = () => {
    if (!(formData.phone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: 'Please enter a valid phone number (e.g., 0333-5223170).',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and phone before submission
    if (!validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Please enter a valid email address.',
      }));
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: 'Please enter a valid phone number (e.g., 0333-5223170).',
      }));
      return;
    }

    // Basic validation checks for required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.dob ||
      !formData.address ||
      !formData.course
    ) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const result = await response.json();
      if (response.ok) {
        alert('Form submitted successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          dob: '',
          address: '',
          course: '',
        });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admission Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input
            list="nameSuggestions"
            type="text"
            id="fullName"
            name="fullName"
            className="form-control"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <datalist id="nameSuggestions">
            {loading ? (
              <option value="Loading suggestions..."></option>
            ) : (
              nameSuggestions.map((name, index) => (
                <option key={index} value={name} />
              ))
            )}
          </datalist>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}  // Email validation on blur
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handlePhoneBlur}  // Phone validation on blur
          />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="dob" className="form-label">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="form-control"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <textarea
            id="address"
            name="address"
            className="form-control"
            placeholder="Enter your address"
            rows="1"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="course" className="form-label">Select Course</label>
          <select
            id="course"
            name="course"
            className="form-select"
            value={formData.course}
            onChange={handleChange}
          >
            <option value="">-- Select Course --</option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
            <option value="commerce">Commerce</option>
          </select>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AdmissionForm;
