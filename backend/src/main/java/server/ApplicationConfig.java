package server;

public class ApplicationConfig {
    private static final String ENV_DEBUG = "DEBUG_MODE";
    private static final String ENV_DATABASE_URL = "DATABASE_URL";

    public static boolean DEBUG = System.getenv(ENV_DEBUG) != null;
    public static String DATABASE_URI = "postgresql://postgres:1234@localhost:5432/postgres"; //System.getenv(ENV_DATABASE_URL);
}
