from setuptools import setup, find_packages

setup(
    name="my-app",
    version="1.0.0",
    description="A comprehensive task management application",
    author="Example Author",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.9",
    install_requires=[
        "flask>=2.3.0",
        "sqlalchemy>=2.0.0",
        "bcrypt>=4.0.0",
        "pydantic>=2.0.0",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
        ],
    },
)
