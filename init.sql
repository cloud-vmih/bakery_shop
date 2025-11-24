-- ================= TẠO ENUM =====================
CREATE TYPE ERole AS ENUM ('ADMIN','STAFF','CUSTOMER');
CREATE TYPE ENotiType AS ENUM ('ORDER','SYSTEM','SUPPORT');
CREATE TYPE EOrderStatus AS ENUM ('PENDING','CONFIRMED','DELIVERING', 'COMPLETED', 'CANCELED');
CREATE TYPE ECakeType AS ENUM ('CHESECAKE','BIRTHDAYCAKE','MOUSE');
CREATE TYPE EPayment AS ENUM ('COD','BANKING');
CREATE TYPE EPayStatus AS ENUM ('PENDING','PAID','FAILED','EXPIRED','REFUNDED');
CREATE TYPE ECategory AS ENUM ('CAKE', 'BREAD', 'COOKIE', 'OTHER');
-- CREATE TYPE EPromoType AS ENUM ('');

-- ================ TẠO BẢNG =====================
CREATE TABLE account(
	id				BIG SERIAL PRIMARY KEY,
	username		VARCHAR(50) NOT NULL, -- không dấu/ký tự đặc biệt
	password 		CHAR(60) NOT NULL,	 -- hash BCrypt có 60 ký tự cố định
	role			ERole	NOT NULL DEFAULT 'CUSTOMER',
);

CREATE TABLE users(
	id				BIGSERIAL PRIMARY KEY,
	fullName		TEXT NOT NULL,
	email			TEXT NOT NULL,
	phoneNumber		VARCHAR(10) NOT NULL,
	dateOfBirth		TIMESTAMP NOT NULL,
	accountID		BIGINT,
	membership		INT,
	avatarURL		TEXT,
	joinAt			TIMESTAMP,
	FOREIGN KEY (accountID)
		REFERENCES account(id)
		-- ON DELETE SET NULL
		-- ON UPDATE CASCADE
);

CREATE TABLE address(
	id				BIGSERIAL,
	customerID		BIGINT NOT NULL,
	addressNumber	CHAR(15) NOT NULL, 
	street			TEXT NOT NULL,
	ward			TEXT NOT NULL,
	isDefault		BOOLEAN DEFAULT TRUE,
	FOREIGN KEY (customerID)
		REFERENCES users(id),
	PRIMARY KEY (id, customerID)
);

CREATE TABLE conversation(
	id				BIGSERIAL PRIMARY KEY,
	customerID		BIGINT REFERENCES users(id),
	supporterID 
);

CREATE TABLE messages(
	id 				BIGSERIAL PRIMARY KEY,
	senderID		BIGINT REFERENCES users(id),
	conversationID	BIGINT REFERENCES conversation(id),
	contents		TEXT NOT NULL,
	sentAt			TIMESTAMP DEFAULT NOW(),
	isRead			BOOLEAN DEFAULT FALSE,
);

CREATE TABLE notification(
	id 				BIGSERIAL PRIMARY KEY,
	title			TEXT NOT NULL,
	contents		TEXT NOT NULL,
	sentAt			TIMESTAMP NOT NULL,
	isRead			BOOLEAN	DEFAULT FALSE,
	notiType		ENotiType NOT NULL,
);

CREATE TABLE notification_user(
	notificationID	BIGINT REFERENCES notification(id),
	userID			BIGINT REFERENCES users(id),
	PRIMARY KEY(notificationID, userID)
);

CREATE TABLE conversation_staff(
	conversationID	BIGINT REFERENCES conversation(id),
	supporterID		BIGINT REFERENCES users(id),
	PRIMARY KEY(conversationID, supporterID)
);

CREATE TABLE item(
	id 				SERIAL PRIMARY KEY,
	name			TEXT NOT NULL,
	description		TEXT NOT NULL,
	price			INT NOT NULL,
	imageURL		TEXT,
	category		ECategory,
	itemDetail		JSON
);

CREATE TABLE wishlist(
	customerID		BIGINT REFERENCES users(id) PRIMARY KEY,
	itemID			BIGINT[] REFERENCES item(id)
);

CREATE TABLE cart(
	id				BIGSERIAL PRIMARY KEY,
	customerID		BIGINT REFERENCES users(id) NOT NULL,
	createAt		TIMESTAMP,
	updateAt		TIMESTAMP
);

CREATE TABLE cartItem(
	id				SERIAL PRIMARY KEY,
	cartID			BIGINT REFERENCES cart(id),
	itemID			INT REFERENCES item(id),
	quantity		INT DEFAULT 1
);

CREATE TABLE orders(
	id				BIGSERIAL PRIMARY KEY,
	customerID		BIGINT REFERENCES users(id),
	createAt		TIMESTAMP DEFAULT NOW(),
	status			EOrderStatus DEFAULT 'PENDING'
);

CREATE TABLE orderDetail(
	orderID			BIGINT REFERENCES orders(id),
	cartItemID		BIGINT	REFERENCES cart(id),
	note			TEXT,
	PRIMARY KEY(orderID, cartItemID)
);

CREATE TABLE payment(
	id 				BIGSERIAL PRIMARY KEY,
	orderID			BIGINT REFERENCES orders(id),
	createAt		TIMESTAMP DEFAULT NOW(),
	status			EPayStatus DEFAULT 'PENDING',
	paymentMethod	EPayment DEFAULT 'COD'
);

CREATE TABLE rating(
	itemID			INT REFERENCES item(id),
	customerID		BIGINT REFERENCES users(id),
	-- rating
	contents		TEXT NOT NULL,
	createAt		TIMESTAMP DEFAULT NOW()
);

CREATE TABLE promotion(
	id				SERIAL PRIMARY KEY,
	title			NVARCHAR(255) NOT NULL,
	description		TEXT NOT NULL,
	-- promotionType
	dicountAmount	BIGINT NOT NULL,
	minTotal		BIGINT NOT NULL,
	startAt			TIMESTAMP NOT NULL,
	endAt			TIMESTAMP
);