create database ursafe_db;
use ursafe_db;

create table users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	fullName varchar(255) not null,
    userName varchar(255) not null unique,
    address text,
    email varchar(255) not null unique,
    phoneNumber varchar(12) not null unique,
    passwordUser varchar(255) not null
    );

create table cctv (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	location VARCHAR(255) NOT NULL,
	latitude DECIMAL(10, 8),
	longitude DECIMAL(11, 8),
	status ENUM('active','inactive') DEFAULT 'active',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cctv (title, location, latitude, longitude) VALUES
('Gang Srikandi - Sungai Raya Dalam', 'Kubu Raya', -0.056, 109.342),
('Jalan Karya Jaya Benteng Laut', 'Sungai Kakap', -0.122, 109.321),
('Gang Bersama - Ngabang', 'Ngabang', -0.392, 109.902);

select * from users;
select * from cctv;

update cctv set status = 'active' where id = 3;