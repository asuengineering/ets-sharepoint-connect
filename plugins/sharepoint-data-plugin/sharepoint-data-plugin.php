<?php
/**
 * Plugin Name: Power Automate Excel to MySQL DB
 * Description: Receives an Excel file from Power Automate, converts it to JSON, and saves it to the WordPress database.
 * Version: 1.0
 * Author: ETS student worker
 */


add_action( 'rest_api_init', 'power_automate_register_endpoint' );

function power_automate_register_endpoint() {
    register_rest_route( 'power-automate/v1', '/excel-to-json', array(
        'methods' => 'POST',
        'callback' => 'power_automate_convert_excel_to_json',
        'permission_callback' => '__return_true',
        'content_type' => 'application/csv',
    ) );

    global $wpdb;

    // Define the table name
    $table_name = $wpdb->prefix . 'my_custom_data_5';

    // Define the SQL query to create the table
    $sql = "CREATE OR REPLACE TABLE $table_name (
        id INT NOT NULL AUTO_INCREMENT,
        software TEXT,
        current_version VARCHAR(255),
        older_version VARCHAR(255),
        support_contact VARCHAR(255),
        my_apps VARCHAR(255),
        my_apps_access TEXT,
        contact_lm VARCHAR(255),
        ets_lm VARCHAR(255),
        planned_labs VARCHAR(255),
        classroom TEXT,
        category TEXT,
        exp_dt TIMESTAMP,
        exp VARCHAR(255),
        inf_web VARCHAR(255),
        lic_r_to VARCHAR(255),
        lic_restrictions TEXT,
        software_description TEXT,
        about TEXT,
        stakeholders TEXT,
        available_sccm TEXT,
        available_offcampus TEXT,
        available_jamf TEXT,
        terms_of_use TEXT,
        image_link VARCHAR(255),
        fse_classroom VARCHAR(255),
        offcampus_comments TEXT,
        os_supported TEXT,
        additional_notes TEXT,
        PRIMARY KEY (id),
    );";

    // Execute the SQL query to create the table
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

function power_automate_convert_excel_to_json( $request ) {
    $csv_data = file_get_contents( 'php://input' );
    
    $rows = explode( "\n", $csv_data );
    $header = str_getcsv( array_shift( $rows ) );
    $data = array();
    foreach ( $rows as $row ) {
        $r = str_getcsv( $row );
        if(count($header) == count($r)) {
            $data[] = array_combine( $header, $r );
        }
    }

    global $wpdb;
    $table  = $wpdb->prefix . 'my_custom_data_5';
    $delete = $wpdb->query("TRUNCATE TABLE $table");
    
    foreach ( $data as $d ) {
        if($d["Expires?"] == "No" && $d["Obsolete? (Move to Older Versions column of Current Version)"] == "No"){
            insert_custom_data($d);
        }
        
    }
    // // print(json_encode($data));
    return array( 'status' => 'ok');
    // return array( 'status' => 'ok'); 
}

function insert_custom_data( $data ) {
    global $wpdb;

    // Define the table name
    $table_name = $wpdb->prefix . 'my_custom_data_5';
    $wpdb->insert( $table_name, array(
        "software" => $data["Software"] ?? "",
        "current_version" => $data["Current Version(s)"] ?? "",
        "older_version" => $data["Older Versions"] ?? "",
        "support_contact" => $data["Support Contact"] ?? "",
        "my_apps" => $data["Available on MyApps?"] ?? "",
        "my_apps_access" => $data["MyApps Access"] ?? "",
        "contact_lm" => $data["Contacts License Manager?"] ?? "",
        "ets_lm" => $data["ETS Managed LM?"] ?? "",
        "planned_labs" => $data["Planned for Labs"] ?? "",
        "classroom" => $data["Classrooms/Labs"] ?? "",
        "category" => $data["Category"] ?? "",
        "exp_dt" => $data["Expiration Date"] ?? "",
        "exp" => $data["Expires?"] ?? "",
        "inf_web" => $data["Information Webpage"] ?? "",
        "lic_r_to" => $data["License Restricted To"] ?? "",
        "lic_restrictions" => $data["License Restrictions"] ?? "",
        "software_description" => $data["Software Description"] ?? "",
        "about" => $data["About"] ?? "",
        "stakeholders" => $data["Stakeholders"] ?? "",
        "available_sccm" => $data["Available on SCCM?"] ?? "",
        "available_offcampus" => $data["Available Off Campus"] ?? "",
        "available_jamf" => $data["Available on JAMF?"] ?? "",
        "terms_of_use" => $data["Terms of Use"] ?? "",
        "image_link" => $data["Image Links"] ?? "",
        "fse_classroom" => $data["Available in FSE Cloud Classroom?"] ?? "",
        "offcampus_comments" => $data["Available Off Campus comments"] ?? "",
        "os_supported" => $data["OS Supported"] ?? "",
        "additional_notes" => $data["Additional Notes"] ?? "",
    ) );
}


add_action( 'rest_api_init', 'get_software_data_from_db' );

function get_software_data_from_db() {
    register_rest_route( 'get-data/v1', '/data', array(
        'methods' => 'GET',
        'callback' => 'get_data',
        'permission_callback' => '__return_true',
    ) );
}

function get_data( $request ) {
    global $wpdb;

    // Define the table name
    $table_name = $wpdb->prefix . 'my_custom_data_5';

    // Get the data from the table
    $data = $wpdb->get_results( "SELECT * FROM $table_name" );


    $results = json_encode($data);

    // Return the results as a JSON response
    return $results;
}







