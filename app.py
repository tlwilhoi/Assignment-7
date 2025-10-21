from flask import Flask, render_template, request, redirect, url_for, flash
import os
from DAL import DatabaseAccessLayer

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this to a random secret key

# Initialize database access layer
dal = DatabaseAccessLayer()

@app.route('/')
def index():
    """Home page route"""
    return render_template('index.html')

@app.route('/about')
def about():
    """About page route"""
    return render_template('about.html')

@app.route('/resume')
def resume():
    """Resume page route"""
    return render_template('resume.html')

@app.route('/projects')
def projects():
    """Projects page route"""
    projects_data = dal.get_all_projects()
    return render_template('projects.html', projects=projects_data)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page route with form handling"""
    if request.method == 'POST':
        # Get form data
        first_name = request.form.get('firstName')
        last_name = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirmPassword')
        message = request.form.get('message')
        
        # Basic validation
        if not first_name or not last_name or not email or not password:
            flash('Please fill in all required fields.', 'error')
            return render_template('contact.html')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return render_template('contact.html')
        
        if len(password) < 8:
            flash('Password must be at least 8 characters long.', 'error')
            return render_template('contact.html')
        
        # If validation passes, redirect to thank you page
        flash('Thank you for your message! I will get back to you soon.', 'success')
        return redirect(url_for('thank_you'))
    
    return render_template('contact.html')

@app.route('/thankyou')
def thank_you():
    """Thank you page route"""
    return render_template('thankyou.html')

@app.route('/add_project', methods=['GET', 'POST'])
def add_project():
    """Add new project page route"""
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        image_filename = request.form.get('image_filename')
        
        # Basic validation
        if not title or not description or not image_filename:
            flash('Please fill in all required fields.', 'error')
            return render_template('add_project.html')
        
        try:
            project_id = dal.add_project(title, description, image_filename)
            flash(f'Project "{title}" added successfully!', 'success')
            return redirect(url_for('projects'))
        except Exception as e:
            flash(f'Error adding project: {str(e)}', 'error')
            return render_template('add_project.html')
    
    return render_template('add_project.html')

@app.route('/edit_project/<int:project_id>', methods=['GET', 'POST'])
def edit_project(project_id):
    """Edit an existing project"""
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        image_filename = request.form.get('image_filename')
        
        # Basic validation
        if not title or not description or not image_filename:
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('edit_project', project_id=project_id))
        
        try:
            success = dal.update_project(project_id, title, description, image_filename)
            if success:
                flash(f'Project "{title}" updated successfully!', 'success')
            else:
                flash('Project not found.', 'error')
            return redirect(url_for('projects'))
        except Exception as e:
            flash(f'Error updating project: {str(e)}', 'error')
            return redirect(url_for('edit_project', project_id=project_id))
    
    # GET request - show edit form
    try:
        project = dal.get_project_by_id(project_id)
        if not project:
            flash('Project not found.', 'error')
            return redirect(url_for('projects'))
        return render_template('edit_project.html', project=project)
    except Exception as e:
        flash(f'Error loading project: {str(e)}', 'error')
        return redirect(url_for('projects'))

@app.route('/delete_project/<int:project_id>', methods=['POST'])
def delete_project(project_id):
    """Delete a project"""
    try:
        success = dal.delete_project(project_id)
        if success:
            flash('Project deleted successfully!', 'success')
        else:
            flash('Project not found.', 'error')
    except Exception as e:
        flash(f'Error deleting project: {str(e)}', 'error')
    
    return redirect(url_for('projects'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
