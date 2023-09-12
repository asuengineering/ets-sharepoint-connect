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
    $table_name = $wpdb->prefix . 'sharepoint_software_data';

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
    $table  = $wpdb->prefix . 'sharepoint_software_data';
    $delete = $wpdb->query("TRUNCATE TABLE $table");
    
    foreach ( $data as $d ) {
        if($d["Expires?"] == "False" && $d["Obsolete? (Move to Older Versions column of Current Version)"] == "False"){
            insert_custom_data($d);
        }
        
    }

    $response_data = array(
        'statusCode' => 200,
        'headers' => array(
            'Content-Type' => 'application/json; charset=utf-8',
        ),
        'body' => json_encode(array('message' => 'Request received successfully')),
    );
    return $response_data;
}

function insert_custom_data( $data ) {
    global $wpdb;

    // Define the table name
    $table_name = $wpdb->prefix . 'sharepoint_software_data';
    $wpdb->insert( $table_name, array(
        "software" => get_string_value($data["Software"] ?? ""),
        "current_version" => get_string_value($data["Current Version(s)"] ?? ""),
        "older_version" => get_string_value($data["Older Versions"] ?? ""),
        "support_contact" => get_string_value($data["Support Contact"] ?? ""),
        "my_apps" => get_string_value($data["Available on MyApps?"] ?? ""),
        "my_apps_access" => get_string_value($data["MyApps Access"] ?? ""),
        "contact_lm" => get_string_value($data["Contacts License Manager?"] ?? ""),
        "ets_lm" => get_string_value($data["ETS Managed LM?"] ?? ""),
        "planned_labs" => get_string_value($data["Planned for Labs"] ?? ""),
        "classroom" => get_string_value($data["Classrooms/Labs"] ?? ""),
        "category" => get_string_value($data["Category"] ?? ""),
        "exp_dt" => get_string_value($data["Expiration Date"] ?? ""),
        "exp" => get_string_value($data["Expires?"] ?? ""),
        "inf_web" => get_string_value($data["Information Webpage"] ?? ""),
        "lic_r_to" => get_string_value($data["License Restricted To"] ?? ""),
        "lic_restrictions" => get_string_value($data["License Restrictions"] ?? ""),
        "software_description" => get_string_value($data["Software Description"] ?? ""),
        "about" => get_string_value($data["About"] ?? ""),
        "stakeholders" => get_string_value($data["Stakeholders"] ?? ""),
        "available_sccm" => get_string_value($data["Available on SCCM?"] ?? ""),
        "available_offcampus" => get_string_value($data["Available Off Campus"] ?? ""),
        "available_jamf" => get_string_value($data["Available on JAMF?"] ?? ""),
        "terms_of_use" => get_string_value($data["Terms of Use"] ?? ""),
        "image_link" => get_string_value($data["Image Links"] ?? ""),
        "fse_classroom" => get_string_value($data["Available in FSE Cloud Classroom?"] ?? ""),
        "offcampus_comments" => get_string_value($data["Available Off Campus comments"] ?? ""),
        "os_supported" => get_string_value($data["OS Supported"] ?? ""),
        "additional_notes" => get_string_value($data["Additional Notes"] ?? ""),
    ));
}

function get_string_value( $data ) {
    if(is_null($data) || strlen($data) == 0){
        return "";
    }
    $value = $data;
    if(substr($data, 0, 1)=="["){
        $valueJson = json_decode($data, true);
        $valueArray = array();
        foreach ($valueJson as $d){
            array_push($valueArray, $d["Value"]);
        }
        $value_string = join(",", $valueArray);
        $value = $value_string ?? "";
    } 
    return $value;
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
    $table_name = $wpdb->prefix . 'sharepoint_software_data';

    // Get the data from the table
    $data = $wpdb->get_results( "SELECT * FROM $table_name" );


    $results = json_encode($data);

    // Return the results as a JSON response
    return $results;
}
