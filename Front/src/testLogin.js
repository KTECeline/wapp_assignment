const testLogin = async () => {
    try {
        const response = await fetch('https://localhost:7093/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loginId: 'test@example.com',
                password: 'test123'
            })
        });
        
        console.log('Response status:', response.status);
        const data = await response.text();
        console.log('Response body:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

testLogin();