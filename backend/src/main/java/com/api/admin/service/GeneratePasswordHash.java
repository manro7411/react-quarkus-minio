import org.mindrot.jbcrypt.BCrypt;

public class GeneratePasswordHash {
    public static void main(String[] args) {
        String password = "admin123";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt(10));

        System.out.println(hash);
        System.out.println("Verify: " + BCrypt.checkpw(password, hash));
    }
}