const API_BASE_URL = 'https://sumith-portfolio-api-g3dra2a9g6haaxev.centralus-01.azurewebsites.net/api' /* import.meta.env.VITE_API_URL || 'http://localhost:3001/api'; */

/**
 * Fetch personal information
 */
export async function getPersonalInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/personal`);
    if (!response.ok) throw new Error('Failed to fetch personal info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching personal info:', error);
    throw error;
  }
}

/**
 * Fetch professional information
 */
export async function getProfessionalInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/professional`);
    if (!response.ok) throw new Error('Failed to fetch professional info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching professional info:', error);
    throw error;
  }
}

/**
 * Fetch complete profile (personal + professional)
 */
export async function getProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Fetch skills
 */
export async function getSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    if (!response.ok) throw new Error('Failed to fetch skills');
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
}

/**
 * Fetch experience
 */
export async function getExperience() {
  try {
    const response = await fetch(`${API_BASE_URL}/experience`);
    if (!response.ok) throw new Error('Failed to fetch experience');
    return await response.json();
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw error;
  }
}

/**
 * Fetch projects
 */
export async function getProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Update personal information
 */
export async function updatePersonalInfo(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/personal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update personal info');
    return await response.json();
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
}

/**
 * Update professional information
 */
export async function updateProfessionalInfo(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/professional`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update professional info');
    return await response.json();
  } catch (error) {
    console.error('Error updating professional info:', error);
    throw error;
  }
}

