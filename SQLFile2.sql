Create DATABASE EstateManagement;
USE Estatemanagement;


-- CLIENT TABLE
CREATE TABLE Client (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    en_number VARCHAR(50) NOT NULL UNIQUE,
    heirs_number INT,
    deceased_id INT,
    children_id INT,
    assets_id INT,
    liabilities_id INT,
    INDEX idx_deceased_id (deceased_id),
    INDEX idx_children_id (children_id),
    INDEX idx_assets_id (assets_id),
    INDEX idx_liabilities_id (liabilities_id)
);



-- CLIENT INFO
CREATE TABLE ClientInfo (
    info_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    id_number VARCHAR(10) NOT NULL UNIQUE,
    tax_number VARCHAR(10) UNIQUE,
    occupation VARCHAR(100),
    salary DECIMAL(15,2),
    residence VARCHAR(255),
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


create table InCaseOfEnergancy(
	c
);

-- INSURANCE POLICY
CREATE TABLE InsurancePolicy (
    policy_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    provider VARCHAR(100) NOT NULL,
    coverage_amount DECIMAL(15,2),
    INDEX idx_asset_id (asset_id),
    FOREIGN KEY (asset_id) REFERENCES Assets(asset_id) ON DELETE CASCADE
);


-- LIST TRUST
CREATE TABLE ListTrust (
    trust_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    trust_name VARCHAR(100) NOT NULL,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- MEDICAL AID SCHEME
CREATE TABLE MedicalAidScheme (
    scheme_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    membership_number VARCHAR(50) NOT NULL UNIQUE,
    provider VARCHAR(100),
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);

-- MotOR VEHICLE
CREATE TABLE MotorVehicle (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50),
    registration_number VARCHAR(50) UNIQUE,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- PROPERTY
CREATE TABLE Property (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    value DECIMAL(15,2),
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- LIABILITIES
CREATE TABLE Liabilities (
    liability_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- MARITAL STATUS
CREATE TABLE MaritalStatus (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- DIVORCE
CREATE TABLE Divorce (
    divorce_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    divorce_date DATE NOT NULL,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- CHILDREN OF DECEASED
CREATE TABLE ChildrenOfDeceased (
    child_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    INDEX idx_client_id (client_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);


-- ADVISOR
CREATE TABLE Advisor (
    advisor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20)
);


- CONTRACT
CREATE TABLE Contract (
    contract_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    advisor_id INT NOT NULL,
    contract_date DATE NOT NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_advisor_id (advisor_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id) REFERENCES Advisor(advisor_id) ON DELETE CASCADE
);

SELECT
    c.en_number AS ClientEN,
    ci.name AS FirstName,
    ci.surname AS LastName,
    ci.id_number AS IDNumber,
    a.name AS AdvisorName,
    ct.contract_date AS ContractDate
FROM Client c
JOIN ClientInfo ci ON c.client_id = ci.client_id
JOIN Contract ct ON c.client_id = ct.client_id
JOIN Advisor a ON ct.advisor_id = a.advisor_id;


SELECT 
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    a.bank_name AS BankName,
    a.description AS AssetDescription,
    ip.policy_number AS InsurancePolicy,
    ip.provider AS InsuranceProvider
FROM ClientInfo ci
JOIN Assets a ON ci.client_id = a.client_id

SELECT
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    ms.status AS MaritalStatus,
    l.description AS Liability,
    l.amount AS LiabilityAmount
FROM ClientInfo ci
JOIN MaritalStatus ms ON ci.client_id = ms.client_id

SELECT
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    p.property_type AS PropertyType,
    p.address AS PropertyAddress,
    mv.make AS VehicleMake,
    mv.model AS VehicleModel,
    mv.registration_number AS VehicleReg
FROM ClientInfo ci
LEFT JOIN Property p ON ci.client_id = p.client_id
LEFT JOIN MinorVehicle mv ON ci.client_id = mv.client_id;

SELECT
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    mas.membership_number AS MedicalAidNumber,
    mas.provider AS MedicalAidProvider,
    lt.trust_name AS TrustName
FROM ClientInfo ci
LEFT JOIN MedicalAidScheme mas ON ci.client_id = mas.client_id
LEFT JOIN ListTrust lt ON ci.client_id = lt.client_id;

SELECT
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    SUM(l.amount) AS TotalLiabilities
FROM ClientInfo ci
JOIN Liabilities l ON ci.client_id = l.client_id
GROUP BY ci.client_id, ci.name, ci.surname;

SELECT
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    COUNT(a.asset_id) AS AssetCount
FROM ClientInfo ci
LEFT JOIN Assets a ON ci.client_id = a.client_id
GROUP BY ci.client_id, ci.name, ci.surname;

SELECT
    AVG(salary) AS AverageSalary
FROM ClientInfo;

SELECT
    ci.name AS ClientName,
    ci.surname AS ClientSurname,
    SUM(ip.coverage_amount) AS TotalCoverage
FROM ClientInfo ci
JOIN Assets a ON ci.client_id = a.client_id
JOIN InsurancePolicy ip ON a.asset_id = ip.asset_id
GROUP BY ci.client_id, ci.name, ci.surname;


SELECT
    a.name AS AdvisorName,
    COUNT(ct.contract_id) AS ContractCount
FROM Advisor a
JOIN Contract ct ON a.advisor_id = ct.advisor_id
GROUP BY a.advisor_id, a.name
ORDER BY ContractCount DESC;

CREATE VIEW ClientFullDetails AS
SELECT 
    c.en_number,
    ci.name,
    ci.surname,
    ci.id_number,
    a.name AS AdvisorName,
    ct.contract_date
FROM Client c
JOIN ClientInfo ci ON c.client_id = ci.client_id
JOIN Contract ct ON c.client_id = ct.client_id
JOIN Advisor a ON ct.advisor_id = a.advisor_id;
