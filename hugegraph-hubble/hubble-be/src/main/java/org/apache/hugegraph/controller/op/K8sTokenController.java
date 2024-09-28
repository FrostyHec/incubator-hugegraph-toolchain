package org.apache.hugegraph.controller.op;

import com.google.common.collect.ImmutableMap;
import lombok.extern.log4j.Log4j2;
import org.apache.hugegraph.common.Constant;
import org.apache.hugegraph.controller.BaseController;
import org.apache.hugegraph.exception.InternalException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Log4j2
@RestController
@RequestMapping(Constant.API_VERSION + "k8s/token")
public class K8sTokenController  extends BaseController {

    @Autowired
    private ApplicationArguments arguments;

    private Path fileDir() {
        String[] args = this.arguments.getSourceArgs();
        if (args.length == 1) {
            return new File(args[0]).getAbsoluteFile().getParentFile().toPath();
        }

        return null;
    }

    @GetMapping
    public Object getK8sToken() {

        Path configDir = fileDir();

        if (null == configDir) {
            throw new InternalException("K8s Token文件不存在");
        }

        Path tokenFile = Paths.get(configDir.toString(), "k8s.token");

        if (Files.exists(tokenFile)) {
            try {
                List<String> lines = Files.readAllLines(tokenFile,
                                                        StandardCharsets.UTF_8);
                return ImmutableMap.of("token", String.join("", lines));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        throw new InternalException("K8s Token文件不存在");
    }

    @GetMapping("dir")
    public Object getK8sToken1() {

        Path configDir = fileDir();
        return ImmutableMap.of("token", configDir.toString());
    }
}
